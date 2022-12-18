#[macro_use] extern crate rocket;

mod board_generator;
//use local_ip_address::list_afinet_netifas;
use obbattu_oxidised::{BoardManager, GameManager, CacheResponder, GameManagerPointer};
use rocket::Config;
//use std::net::{IpAddr, Ipv4Addr};

use std::{path::Path, collections::VecDeque, sync::Arc};
use chrono::Utc;
use rocket::{State, fs::NamedFile, http::ContentType, tokio::sync::Mutex, fairing::AdHoc, response::{Redirect, content::{RawJson}}};
use serde_json::{json, to_string};
use tokio_cron_scheduler::{JobScheduler, Job};

type BoardVecPointer = Arc<Mutex<VecDeque<BoardManager>>>;

/* #[get("/boards")]
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
} */

#[get("/robots.txt")]
async fn robots() -> CacheResponder<String> {
    CacheResponder::new(String::from("User-agent: *
Disallow: /game_stats/
Disallow: /get-board/
Disallow: /played/

# Whoah, no one looks in here! What u doing here?
"), ContentType::Text)
}

#[get("/played/<solved>")]
async fn played_counter(solved: bool, game_state: &State<GameManagerPointer>) {
    let mut locked = game_state.lock().await;
    if solved == true{
        locked.increment_won().await;
    } else {
        locked.increment_played().await;
    }
}

#[get("/claim")]
async fn claim_rickroll() -> Redirect {
    Redirect::to(uri!("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
}

#[get("/game_stats")]
async fn game_stats(game_state: &State<GameManagerPointer>) -> Result<String, String> {
    let locked = game_state.lock().await;
    let res = serde_json::to_string(&*locked);
    if let Ok(res_str) = res {
        return Ok(res_str);
    }

    Err(String::from("Could not convert stats to string"))
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
#[get("/manifest.webmanifest")]
async fn manifest() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("manifest.webmanifest")).await.unwrap(),
        ContentType::JSON
    )
}
#[get("/service-worker.js")]
async fn service_worker() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("service-worker.js")).await.unwrap(),
        ContentType::JavaScript
    )
}
#[get("/obbattu.png")]
async fn icon_small() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("obbattu.png")).await.unwrap(),
        ContentType::PNG
    )
}
#[get("/obbattu-big.png")]
async fn icon_big() -> CacheResponder<NamedFile> {
    CacheResponder::new(
        NamedFile::open(Path::new(".").join("ObbattuFrontend").join("public").join("obbattu-big.png")).await.unwrap(),
        ContentType::PNG
    )
}
#[get("/favicon.ico")]
async fn favicon_ico() -> CacheResponder<NamedFile> {
    favicon().await
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

    sched.add(Job::new_async("0 0 10 * * *", move |_uuid, _l| {

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

    /* let ifas = list_afinet_netifas().unwrap();
    if let Some((_, ipaddr)) = ifas.iter().find(|(name, ipaddr)| (*name).to_lowercase().contains("wi") && matches!(ipaddr, IpAddr::V4(_))){
        println!("Connect to 'http://{:?}:1845'", ipaddr);   
    } */

    let mut conf = Config::release_default();
    conf.port = 1337;

    rocket::custom(conf)
        .manage(board_vec_clone.clone())
        .manage(game_state_clone.clone())
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
            .await;

            GameManager::save(
                &*(game_state_clone
                    .clone()
                    .lock()
                    .await
                )
            ).await;
        })))
        .mount("/", routes![get_board, index, //UI board and elements
                                    global_css, bundled_css, bundled_js, favicon, favicon_ico, bundled_js_map, //HTML and other elements
                                    stats, played_counter, game_stats, robots, //Stats and SEO related
                                    manifest, service_worker, icon_small, icon_big,
                                    claim_rickroll, //redirect
                                    //boards
                                ])
}