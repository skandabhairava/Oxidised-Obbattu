mod board_generator;
use std::sync::Arc;

use rand::Rng;
use std::convert::AsMut;
use rocket::tokio::sync::Mutex;

use board_generator::{Board, split};

pub type BoardManagerPointer = Arc<Mutex<BoardManager>>;

pub type GameManagerPointer = Arc<Mutex<GameManager>>;

//////////////////////////////////////////
pub struct GameManager{
    pub daily_count: u32,
    pub boards_played: u32
}
    impl GameManager {
        pub async fn new() -> GameManagerPointer {
            Arc::new(Mutex::new(Self { daily_count:0, boards_played: 0 }))
        }

        pub async fn increment_daily(&mut self) {
            self.daily_count += 1;
        }

        pub async fn reset_daily(&mut self) {
            self.daily_count = 0;
        }

        pub async fn increment_played(&mut self) {
            self.boards_played += 1;
        }

        pub async fn reset_played(&mut self) {
            self.boards_played = 0;
        }
    }

//////////////////////////////////////////
#[allow(dead_code)]
pub struct BoardManager{
    pub board: Board,
    pub answers: [[String; 5]; 6],
    pub answers_to_show: [[String; 5]; 5],
    pub questions: [[String; 5]; 5]
}
    impl BoardManager {
        pub async fn new() -> BoardManagerPointer {

            let generated_board: Board = (
                split(String::from("ಪಕ್ವಮಾಡಿದ")).await.try_into().unwrap(), 
                split(String::from("ದವರೆಲ್ಲರೂ")).await.try_into().unwrap(), 
                split(String::from("ಪಶ್ಚಿಮದಿಂದ")).await.try_into().unwrap(),
                split(String::from("ದವರೆಲ್ಲರೂ")).await.try_into().unwrap(),
                split(String::from("ಮಾಡುತ್ತಿದ್ದಾರೆ")).await.try_into().unwrap(),
                split(String::from("ಮರೆತ್ತಿದ್ದಾರೆ")).await.try_into().unwrap()
                );

            let ans_to_show = Self::generate_answers_to_show(generated_board.clone());

            let board = Self {
                board: generated_board.clone(),
                answers: Self::generate_answers(generated_board),
                answers_to_show: ans_to_show.clone(),
                questions: Self::generate_questions(ans_to_show).await
            };

            Arc::new(Mutex::new( board ))
        }

        pub async fn set_new_board(&mut self, board: Board) {
            self.board = board.clone();
            self.answers = Self::generate_answers(board.clone());
            self.answers_to_show = Self::generate_answers_to_show(board.clone());
            self.questions = Self::generate_questions(self.answers_to_show.clone()).await;
        }

        pub fn generate_answers(board: Board) -> [[String; 5]; 6] {
            [board.0, board.1, board.2, board.3, board.4, board.5]
        }

        pub fn generate_answers_to_show(answers: Board) -> [[String; 5]; 5] {
            [
                [answers.0[0].clone(), answers.0[1].clone(),  answers.0[2].clone(), answers.0[3].clone(),  answers.0[4].clone()],
                [answers.2[1].clone(), String::from(""),      answers.4[1].clone(), String::from(""),       answers.1[1].clone()],
                [answers.2[2].clone(), answers.5[1].clone(),  answers.4[2].clone(), answers.5[3].clone(),  answers.1[2].clone()],
                [answers.2[3].clone(), String::from(""),      answers.4[3].clone(), String::from(""),       answers.1[3].clone()],
                [answers.2[4].clone(), answers.3[1].clone(),  answers.4[4].clone(), answers.3[3].clone(),  answers.1[4].clone()]
            ]
        }

        pub async fn generate_questions(ans_to_show: [[String; 5]; 5]) -> [[String; 5]; 5] {

            let mut one_d_arr: Vec<String> = ans_to_show
                                            .iter()
                                            .flat_map(|array| array.iter())
                                            .cloned()
                                            .collect();

            //println!("{:?}", one_d_arr);

            let locked_chars: [usize; 9] = [0, 4, 6, 8, 12, 16, 18, 20, 24];

            for i in 0..one_d_arr.len() {

                if locked_chars.contains(&i) {
                    continue;
                }

                let mut random: usize = rand::thread_rng().gen_range(0..one_d_arr.len()) as usize;
                while locked_chars.contains(&random) {
                    random = rand::thread_rng().gen_range(0..one_d_arr.len()) as usize;
                }
                //println!("{:?}", locked_chars);

                //println!("i: {}, random: {}", i, random);

                (one_d_arr[i], one_d_arr[random]) = (one_d_arr[random].clone(), one_d_arr[i].clone());
            }

            [
                sliice(&one_d_arr[0..5]),
                sliice(&one_d_arr[5..10]),
                sliice(&one_d_arr[10..15]),
                sliice(&one_d_arr[15..20]),
                sliice(&one_d_arr[20..25]),
            ]
        }
    }
//////////////////////////////////////////

fn sliice<A, T>(slice: &[T]) -> A
where A: Sized + Default + AsMut<[T]>,
      T: Clone
{
let mut a = Default::default();
<A as AsMut<[T]>>::as_mut(&mut a).clone_from_slice(slice);
a
}