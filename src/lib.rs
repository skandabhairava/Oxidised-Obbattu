mod board_generator;
use std::sync::Arc;

use chrono::{DateTime, Utc};
use rocket::tokio::sync::Mutex;

use board_generator::Board;

pub type BoardManagerPointer = Arc<Mutex<BoardManager>>;
//////////////////////////////////////////
#[allow(dead_code)]
pub struct BoardManager{
    new_board: Option<(String, String, String, String, String, String)>,
    pub board: (String, String, String, String, String, String),
    pub last_created: DateTime<Utc>,
    boards_solved: u32
}
    impl BoardManager {
        pub async fn new() -> BoardManagerPointer {
            let utc_time_rn = Utc::now();
            //Arc::new(Mutex::new(Self { new_board: None, board: board_generator::create_board().await, last_created: utc_time_rn, boards_solved: 0 }))
            Arc::new(Mutex::new(Self { new_board: None, board: (String::from("test0"), String::from("test1"), String::from("test2"), String::from("test3"), String::from("test4"), String::from("test5")), last_created: utc_time_rn, boards_solved: 0 }))
        }

        pub async fn create_board(&mut self, board: Board) {
            self.new_board = Some(board);
        }

        pub async fn set_new_board(&mut self) {

            let utc_time_rn = Utc::now();

            if let Some(new_board) = self.new_board.clone() {
                self.board = new_board;
                self.new_board = None;

                self.last_created = utc_time_rn;

                return;
            }

            self.last_created = utc_time_rn;
            self.board = board_generator::create_board().await;
        }

        pub fn reset_boards_solved(&mut self) {
            self.boards_solved = 0;
        }

        pub fn increment_boards_solved(&mut self) {
            self.boards_solved += 1;
        }
    }
//////////////////////////////////////////