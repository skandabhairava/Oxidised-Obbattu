mod board_generator;
//mod sync_board_generator;
//use std::{thread, time::Duration};

#[allow(unused_imports)]
#[macro_use] extern crate rocket;
//use chrono::{Local, DateTime, Utc, FixedOffset, TimeZone};
//use chrono_tz::Tz;
use chrono::{Local, Utc};

use obbattu_oxidised::{BoardManager, BoardManagerPointer};
use rocket::State;

use tokio_cron_scheduler::{JobScheduler, Job};
/* use rocket::tokio::time::sleep;
use core::time::Duration; */

/* use rocket::tokio::sync::Mutex;
use std::sync::Arc; */

#[get("/")]
async fn hello(board_state: &State<BoardManagerPointer>) -> String {
    
    let time_1 = Local::now();
    let board = board_state.lock().await;
    let board_info = format!("{} {} {} {} {} {}", board.board.0, board.board.1, board.board.2, board.board.3, board.board.4, board.board.5);
    drop(board);

    format!("Hallo! \n{}\n\n\n{}", time_1, board_info)
}

#[launch]
async fn rocket() -> _ {

    let mut sched = JobScheduler::new().unwrap();

    let state = BoardManager::new().await;
    let state_clone = state.clone();

    sched.add(Job::new_async("5 0/5 * * * *", move |_uuid, _l| {

        let state_clone = state.clone();

        Box::pin( async {
            let time_1 = Utc::now();
    
            println!(">> STARTING BOARD GENERATION\nUTC Time now: {}", time_1);

            let board = board_generator::create_board().await;

            let mut locked = state_clone.lock().await;
            locked.create_board(board).await;
            locked.set_new_board().await;
            println!("{:#?}", locked.board);
            println!("Finished board generation...");
            drop(locked);
            drop(state_clone);
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
        .manage(state_clone.clone())
        .mount("/", routes![hello])
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