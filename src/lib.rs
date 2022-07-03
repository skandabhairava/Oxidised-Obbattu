mod board_generator;
use std::path::Path;
use std::sync::Arc;

use chrono::{Utc, Duration, Datelike};

use rand::Rng;
use rocket::http::{Header, ContentType};
use rocket::response::Responder;
use rocket::tokio::fs;
use serde::{Deserialize, Serialize};
use std::convert::AsMut;
use rocket::tokio::sync::Mutex;

use board_generator::{Board, split};

pub type GameManagerPointer = Arc<Mutex<GameManager>>;

//////////////////////////////////////////
#[derive(Responder)]
pub struct CacheResponder<T>
{
    inner: T,
    header: Header<'static>,
    content_type: ContentType
}
    impl<'r, 'o: 'r, T: Responder<'r, 'o>> CacheResponder<T>  {
        pub fn new(inner: T, content_type: ContentType) -> Self {
            Self {
                inner,
                header: Header::new("Cache-Control", "max-age=864000"),
                content_type
            }
        }
    }
//////////////////////////////////////////

//////////////////////////////////////////
pub struct GameManager{
    pub boards_played: u32
}
    impl GameManager {
        pub async fn new() -> GameManagerPointer {
            Arc::new(Mutex::new(Self { boards_played: 0 }))
        }

        pub async fn increment_played(&mut self) {
            self.boards_played += 1;
        }

        pub async fn reset_played(&mut self) {
            self.boards_played = 0;
        }
    }

//////////////////////////////////////////
//#[allow(dead_code)]
#[derive(Clone, Deserialize, Serialize)]
pub struct BoardManager{
    pub board: Board,
    pub answers: [[String; 5]; 6],
    pub answers_to_show: [[String; 5]; 5],
    pub questions: [[String; 5]; 5],
    pub date: u16,
    pub daily_count: u32,
}
    impl BoardManager {

        pub async fn save(vector_save: &Vec<Self>) {
            println!("Saving board...");
            fs::write(Path::new(".").join("board_save.json"), serde_json::to_string(&vector_save).unwrap()).await.unwrap();
        }

        pub async fn load() -> Option<Vec<Self>> {
            if Path::new(".").join("board_save.json").exists() {
                println!("Loading up old board...");
                return serde_json::from_str(&fs::read_to_string(Path::new(".").join("board_save.json")).await.unwrap()).ok();
            }
            None
        }

        pub async fn new() -> Vec<Self> {

            let loaded = Self::load().await;
            if let Some(mut vector_save) = loaded {

                vector_save[0].daily_count = 0;
                if Utc::now() < Utc::now().date().and_hms(10, 0, 0) {
                    vector_save[0].date = (Utc::now() - Duration::days(1)).day() as u16;
                    vector_save[1].date = Utc::now().day() as u16;
                } else {
                    vector_save[0].date = Utc::now().day() as u16;
                }

                return vector_save;
            }

            let generated_board: Board = (
                split(String::from("ಪಕ್ವಮಾಡಿದ")).await.try_into().unwrap(), 
                split(String::from("ದವರೆಲ್ಲರೂ")).await.try_into().unwrap(), 
                split(String::from("ಪಶ್ಚಿಮದಿಂದ")).await.try_into().unwrap(),
                split(String::from("ದವರೆಲ್ಲರೂ")).await.try_into().unwrap(),
                split(String::from("ಮಾಡುತ್ತಿದ್ದಾರೆ")).await.try_into().unwrap(),
                split(String::from("ಮರೆತ್ತಿದ್ದಾರೆ")).await.try_into().unwrap()
            );
            let generated_board2: Board = (
                split(String::from("ಹೊಡೆದಿದ್ದಾರೆ")).await.try_into().unwrap(), 
                split(String::from("ರೆಚೀನನನ್ನೂ")).await.try_into().unwrap(), 
                split(String::from("ಹೊರಬರುವ")).await.try_into().unwrap(),
                split(String::from("ವರಿಗೆಇನ್ನೂ")).await.try_into().unwrap(),
                split(String::from("ದಿನಗಳಿಗೆ")).await.try_into().unwrap(),
                split(String::from("ಬಲಗಣ್ಣಿನ")).await.try_into().unwrap()
            );

            let mut ret = Self::new_from(generated_board, 0).await;
            let mut ret2 = Self::new_from(generated_board2, 0).await;

            ret.daily_count = 0;

            if Utc::now() < Utc::now().date().and_hms(10, 0, 0) {
                ret.date = (Utc::now() - Duration::days(1)).day() as u16;
                ret2.date = Utc::now().day() as u16;
            } else {
                ret.date = Utc::now().day() as u16;
            }

            let save = vec![ret, ret2];
            Self::save(&save).await;

            save
        }

        pub async fn new_from(board: Board, prev_count: u32) -> Self {
            let ans_to_show = Self::generate_answers_to_show(board.clone());

            let date = (Utc::now() + Duration::days(1)).day() as u16;

            Self {
                board: board.clone(),
                answers: Self::generate_answers(board),
                answers_to_show: ans_to_show.clone(),
                questions: Self::generate_questions(ans_to_show).await,
                date,
                daily_count: prev_count + 1
            }
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