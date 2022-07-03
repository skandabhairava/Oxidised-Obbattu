mod board_generator;

#[allow(unused_imports)]
#[macro_use] extern crate rocket;
use std::path::Path;
use std::collections::VecDeque;
use std::sync::Arc;

use chrono::Utc;

use obbattu_oxidised::{BoardManager, GameManager, CacheResponder};

use rocket::State;
use rocket::fs::NamedFile;
use rocket::http::ContentType;
use rocket::response::{content::{RawJson}};
use rocket::tokio::sync::Mutex;
use rocket::fairing::AdHoc;

use serde_json::{json, to_string};

use tokio_cron_scheduler::{JobScheduler, Job};

type BoardVecPointer = Arc<Mutex<VecDeque<BoardManager>>>;

#[get("/boards")]
async fn boards(board_state: &State<BoardVecPointer>) -> RawJson<String>{
    let board_vec = board_state.lock().await;
    RawJson(to_string(&board_vec.clone()
                            .iter()
                            .map(|x| {
                                    x.to_owned()
                                }
                            )
                            .collect::<Vec<BoardManager>>()
            ).unwrap())
}

#[get("/get-board/<date>")]
async fn get_board(date: u16, board_state: &State<BoardVecPointer>) -> Result<RawJson<String>, RawJson<String>> {
    
    let board_vec = board_state.lock().await;
    let board_vec_copy = board_vec.clone();
    drop(board_vec);

    for board in board_vec_copy.into_iter() {
        if board.date == date {
            return Ok(RawJson(
                to_string(
                    &json!({
                        "answers": board.answers,
                        "answers_to_show": board.answers_to_show,
                        "questions": board.questions,
                        "OBBATTU_COUNT": board.daily_count,
                    })
                ).unwrap()
            ));
        }
    }

    return Err(
        RawJson(
            to_string(
                &json!({
                    "answers": null,
                    "answers_to_show": null,
                    "questions": null,
                    "OBBATTU_COUNT": null
                })
            ).unwrap()
        )
    );
}

#[get("/")]
async fn index<'r>() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("index.html")).await.unwrap(),
        ContentType::HTML
    )
}
#[get("/global.css")]
async fn global_css() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("global.css")).await.unwrap(),
        ContentType::CSS
    )
}
#[get("/build/bundle.css")]
async fn bundled_css() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.css")).await.unwrap(),
        ContentType::CSS
    )
}
#[get("/build/bundle.js")]
async fn bundled_js() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.js")).await.unwrap(),
        ContentType::JavaScript
    )
}
#[get("/build/bundle.js.map")]
async fn bundled_js_map() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.js.map")).await.unwrap(),
        ContentType::JavaScript
    )
}
#[get("/favicon.png")]
async fn favicon() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("favicon.png")).await.unwrap(),
        ContentType::PNG
    )
}
#[get("/stats.png")]
async fn stats() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("stats.png")).await.unwrap(),
        ContentType::PNG
    )
}

#[launch]
async fn rocket() -> _ {

    let mut sched = JobScheduler::new().unwrap();

    let board_vec = Arc::new(Mutex::new(VecDeque::from(BoardManager::new().await)));
    let game_state = GameManager::new().await;

    let board_vec_clone = board_vec.clone();
    let game_state_clone = game_state.clone();

    sched.add(Job::new_async("0 41 11 * * *", move |_uuid, _l| {

        let board_vec_clone = board_vec.clone();

        Box::pin( async {
            let time_1 = Utc::now();
    
            println!(">> STARTING BOARD GENERATION\nUTC Time now: {}", time_1);

            let board = board_generator::create_board().await;

            let mut locked = board_vec_clone.lock().await;
            let mut prev_count = 0;
            if let Some(count) = locked.back() {
                prev_count = count.daily_count;
            }
            let new_board_manager = BoardManager::new_from(board, prev_count).await;
            locked.push_back(new_board_manager);

            if locked.len() > 2 {
                locked.pop_front();
            }
            drop(locked);
            drop(board_vec_clone);

            println!("Finished board generation...");
        })
    }).unwrap()).unwrap();

    #[cfg(feature = "signal")]
    sched.shutdown_on_ctrl_c();

    sched.set_shutdown_handler(Box::new(|| {
        Box::pin(async {
          println!("Shutting down asnyc board generation task"); // might not show up as rocket async runtime takes care of it 
        })
      }));

    sched.start().unwrap();

    rocket::build()
        .manage(board_vec_clone.clone())
        .manage(game_state_clone)
        .attach(AdHoc::on_shutdown("Saving board", |_| Box::pin(async move {
            BoardManager::save(
                &(board_vec_clone
                                .clone()
                                .lock()
                                .await
                                .iter()
                                .map(|x| {
                                        x.to_owned()
                                    }
                                )
                                .collect::<Vec<BoardManager>>()
                            )
                        )
                        .await
        })))
        .mount("/", routes![get_board, index, global_css, bundled_css, bundled_js, favicon, bundled_js_map, stats, boards])
}


/* #[rocket::main]
async fn main() {
    //let utc_time_rn = Utc::now().naive_utc();

    //let earliest_offset = FixedOffset::east(14 * 3600);
    //let datetime: DateTime<FixedOffset> = earliest_offset.from_utc_datetime(&utc_time_rn);

    println!("{:#?}", board_generator::create_board().await);
} */

/* fn main() {
    println!("{:#?}", sync_board_generator::create_board());
} */