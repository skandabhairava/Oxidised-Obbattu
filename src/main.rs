mod board_generator;

#[allow(unused_imports)]
#[macro_use] extern crate rocket;
use std::path::Path;

use chrono::{Utc};

use obbattu_oxidised::{BoardManager, BoardManagerPointer, GameManager};
use rocket::State;
use rocket::fs::NamedFile;
use rocket::response::content::{RawJson, RawHtml, RawCss, RawJavaScript};
use rocket::tokio::fs::read_to_string;

use serde_json::{json, to_string};

use tokio_cron_scheduler::{JobScheduler, Job};

#[get("/get-board")]
async fn get_board(board_state: &State<BoardManagerPointer>) -> RawJson<String> {
    
    // let time_1 = Local::now();
    let board = board_state.lock().await;
    // let question = &board.answers;

    return RawJson(
        to_string(
            &json!({
                "answers": board.answers,
                "answers_to_show": board.answers_to_show,
                "questions": board.questions
            })
        ).unwrap()
    );
}

#[get("/")]
async fn index() -> RawHtml<String> {
    RawHtml(
        read_to_string(Path::new(".").join("ObbattuFrontend").join("public").join("index.html")).await.unwrap()
    )
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

    let board_state = BoardManager::new().await;
    let game_state = GameManager::new().await;


    let board_state_clone = board_state.clone();
    let game_state_clone = game_state.clone();

    sched.add(Job::new_async("0 0/10 * * * *", move |_uuid, _l| {

        let board_state_clone = board_state.clone();
        let game_state_clone = game_state.clone();

        Box::pin( async {
            let time_1 = Utc::now();
    
            println!(">> STARTING BOARD GENERATION\nUTC Time now: {}", time_1);

            let board = board_generator::create_board().await;

            let mut locked = board_state_clone.lock().await;
            locked.set_new_board(board).await;
            println!("{:#?}", locked.board);
            drop(locked);
            drop(board_state_clone);

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
        .manage(board_state_clone.clone())
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