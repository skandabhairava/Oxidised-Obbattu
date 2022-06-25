mod board_generator;

#[allow(unused_imports)]
#[macro_use] extern crate rocket;
use std::path::Path;
use std::collections::VecDeque;
use std::sync::Arc;

use chrono::Utc;

use obbattu_oxidised::{BoardManager, GameManager};
use rocket::State;
use rocket::fs::NamedFile;
use rocket::response::content::{RawJson, RawHtml, RawCss, RawJavaScript};
use rocket::tokio::fs::read_to_string;

use rocket_cache_response::CacheResponse;

use rocket::tokio::sync::Mutex;
use serde_json::{json, to_string};

use tokio_cron_scheduler::{JobScheduler, Job};

type BoardVecPointer = Arc<Mutex<VecDeque<BoardManager>>>;

#[get("/get-board/<date>")]
async fn get_board(date: u16, board_state: &State<BoardVecPointer>) -> Result<RawJson<String>, RawJson<String>> {
    
    // let time_1 = Local::now();
    let board_vec = board_state.lock().await;
    let board_vec_copy = board_vec.clone();
    drop(board_vec);

    let mut board_copy = None;

    for board in board_vec_copy.into_iter() {
        if board.date == date {
            board_copy = Some(board);
        }
    }

    if let None = board_copy {
        return Err(
            RawJson(
                to_string(
                    &json!({
                        "answers": null,
                        "answers_to_show": null,
                        "questions": null
                    })
                ).unwrap()
            )
        );
    } 

    let board_copy = board_copy.unwrap();

    Ok(RawJson(
        to_string(
            &json!({
                "answers": board_copy.answers,
                "answers_to_show": board_copy.answers_to_show,
                "questions": board_copy.questions
            })
        ).unwrap()
    ))
}

#[get("/")]
async fn index() -> CacheResponse<RawHtml<String>> {
    CacheResponse::Public(RawHtml(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("index.html")).await.unwrap()
    ), 432000, false)
}
#[get("/global.css")]
async fn global_css() -> RawCss<String> {
    RawCss(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("global.css")).await.unwrap()
    )
}
#[get("/build/bundle.css")]
async fn bundled_css() -> RawCss<String> {
    RawCss(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.css")).await.unwrap()
    )
}
#[get("/build/bundle.js")]
async fn bundled_js() -> RawJavaScript<String> {
    RawJavaScript(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.js")).await.unwrap()
    )
}
#[get("/build/bundle.js.map")]
async fn bundled_js_map() -> RawJavaScript<String> {
    RawJavaScript(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("build").join("bundle.js.map")).await.unwrap()
    )
}
#[get("/favicon.png")]
async fn favicon() -> Option<NamedFile> {
    NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("favicon.png")).await.ok()
}
#[get("/stats.png")]
async fn stats() -> Option<NamedFile> {
    NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("stats.png")).await.ok()
}

#[launch]
async fn rocket() -> _ {

    let mut sched = JobScheduler::new().unwrap();

    let board_vec = Arc::new(Mutex::new(VecDeque::from([BoardManager::new().await])));
    let game_state = GameManager::new().await;

    let board_vec_clone = board_vec.clone();
    let game_state_clone = game_state.clone();

    sched.add(Job::new_async("0 0 10 * * *", move |_uuid, _l| {

        let board_vec_clone = board_vec.clone();
        let game_state_clone = game_state.clone();

        Box::pin( async {
            let time_1 = Utc::now();
    
            println!(">> STARTING BOARD GENERATION\nUTC Time now: {}", time_1);

            let board = board_generator::create_board().await;
            let new_board_manager = BoardManager::new_from(board).await;

            let mut locked = board_vec_clone.lock().await;
            locked.push_back(new_board_manager);

            if locked.len() > 2 {
                locked.pop_front();
            }
            // println!("{:#?}", locked.board);
            drop(locked);
            drop(board_vec_clone);

            let mut locked = game_state_clone.lock().await;
            locked.increment_daily().await;
            drop(locked);
            drop(game_state_clone);

            println!("Finished board generation...");
        })
    }).unwrap()).unwrap();

    /* let counter = Arc::new(Mutex::new(0));

    sched.add(Job::new_async("1/2 * * * * *", move |_uuid, _l| {
        let counter_clone = counter.clone();
        Box::pin( async move {
            let mut count = counter_clone.lock().await;
            if *count == 60 {
                *count = 0;
            } else {
                *count += 2;
            }

            println!("{}", *count);
        })

    }).unwrap()).unwrap(); */

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
        .mount("/", routes![get_board, index, global_css, bundled_css, bundled_js, favicon, bundled_js_map, stats])
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