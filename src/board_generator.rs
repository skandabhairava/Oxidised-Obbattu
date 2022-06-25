use lazy_static::lazy_static;
use std::{collections::{HashMap, HashSet}, path::Path};

//use rocket::tokio::{io::{self, AsyncBufReadExt}, fs::File};
use rocket::tokio::{io::{self, AsyncBufReadExt}, fs::File};
use unicode_segmentation::UnicodeSegmentation;
use rand::{Rng, seq::SliceRandom};

#[allow(dead_code)]
const KANNADA_OTTAKSHARAS: [&str; 34] = ["ಕ್", "ಖ್", "ಗ್", "ಘ್", "ಙ್", "ಚ್", "ಛ್", "ಜ್", "ಝ್", "ಞ್", "ಟ್", "ಠ್", "ಡ್", "ಢ್", "ಣ್", "ತ್", "ಥ್", "ದ್", "ಧ್", "ನ್", "ಪ್", "ಫ್", "ಬ್", "ಭ್", "ಮ್", "ಯ್", "ರ್", "ಲ್", "ವ್", "ಶ್", "ಷ್", "ಸ್", "ಹ್", "ಳ್"];

#[allow(dead_code)]
const SHORTENED_LINES: u16 = 20113;
lazy_static! {
    static ref LINE_RANGE: HashMap<&'static str, (u16, u16)> = {
        let mut m = HashMap::new();
        m.insert("ಅ", (0, 1197));
        m.insert("ಆ", (1197, 1742));
        m.insert("ಇ", (1742, 2194));
        m.insert("ಈ", (2194, 2231));
        m.insert("ಉ", (2231, 2529));
        m.insert("ಊ", (2529, 2576));
        m.insert("ಋ", (2576, 2577));
        m.insert("ಎ", (2577, 3004));
        m.insert("ಏ", (3004, 3095));
        m.insert("ಐ", (3095, 3137));
        m.insert("ಒ", (3137, 3438));
        m.insert("ಓ", (3438, 3508));
        m.insert("ಔ", (3508, 3516));

        m.insert("ಕ", (3516, 5887));
        m.insert("ಖ", (5887, 5905));
        m.insert("ಗ", (5905, 6460));
        m.insert("ಘ", (6460, 6493));

        m.insert("ಚ", (6493, 6702));
        m.insert("ಛ", (6702, 6705));
        m.insert("ಜ", (6705, 7023));
        m.insert("ಝ", (7023, 7026));

        m.insert("ಟ",(7026, 7038));
        m.insert("ಠ", (7038, 7041));
        m.insert("ಡ", (7041, 7060));
        m.insert("ಣ", (7060, 7063));

        m.insert("ತ", (7063, 8163));
        m.insert("ಥ", (8163, 8166));
        m.insert("ದ", (8166, 8989));
        m.insert("ಧ", (8989, 9068));
        m.insert("ನ", (9068, 10418));

        m.insert("ಪ", (10418, 11420));
        m.insert("ಫ", (11420, 11488));
        m.insert("ಬ", (11488, 12847));
        m.insert("ಭ", (12847, 13040));
        m.insert("ಮ", (13040, 14600));

        m.insert("ಯ", (14600, 15162));
        m.insert("ರ", (15162, 15493));
        m.insert("ಲ", (15493, 15654));
        m.insert("ಳ", (15654, 15661));
        m.insert("ವ", (15661, 16401));
        m.insert("ಶ", (16401, 16770));
        m.insert("ಷ", (16770, 16779));
        m.insert("ಸ", (16779, 18386));
        m.insert("ಹ", (18386, 20113));

        m
    };
}

pub type Board = ([String; 5], [String; 5], [String; 5], [String; 5], [String; 5], [String; 5]);

//////////////////////////////////////////////////
#[derive(Debug, Clone, PartialEq)]
pub struct FindOneCache{
    original_list: Vec<String>,
    crossed_out: Vec<String>,
    result: Option<String>
}
    impl FindOneCache {
        #[allow(dead_code)]
        fn new(original_list: Vec<String>, crossed_out: Vec<String>, result: Option<String>) -> Self{
            Self { original_list, crossed_out, result }
        }
    }
//////////////////////////////////////////////////

#[derive(Debug, Clone, PartialEq)]
pub struct RandomCache{
    crossed_out: Vec<u16>,
    result: Option<String>
}
    impl RandomCache {
        #[allow(dead_code)]
        fn new(crossed_out: Vec<u16>, result: Option<String>) -> Self {
            Self { crossed_out, result}
        }
    }
//////////////////////////////////////////////////

/// Iterator which reads a file line by line
#[allow(dead_code)]
async fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>
{
    let file = File::open(filename).await?;
    Ok(io::BufReader::new(file).lines())
}

#[allow(dead_code)]
pub async fn split(mut word: String) -> Vec<String>{
    if word.ends_with("\n") {
        word = word[..word.len()-1].to_owned();
    }

    let mut buffer = String::from("");
    let mut collect_list: Vec<String> = vec![];

    for i in word.graphemes(true) {
        if KANNADA_OTTAKSHARAS.contains(&i){
            buffer.push_str(i); //BUFFER is to store ottaksharas; "ನ್" + "ನೂ" -> "ನ್ನೂ"
            continue;
        }

        collect_list.push(buffer + i);
        buffer = "".to_owned();
    }

    collect_list
}

#[allow(dead_code)]
async fn find(starts_with: Option<String>, ends_with: Option<String>, middle_char: Option<String>) -> Vec<String> {
    let mut range_line: (u16, u16) = (0, 20113);

    if let Some(starts_with) = &starts_with{
        let mut found = false;
        for (key, val) in LINE_RANGE.iter(){
            if starts_with.contains(key) {
                range_line = val.to_owned();
                found = true;
                break;
            }
        }

        if !found {
            return vec![];
        }
    } else {
        range_line = (rand::thread_rng().gen_range(0..(100 + 1)), rand::thread_rng().gen_range(0..(200 + 20113 + 1)))
    }

    if let Ok(mut lines) = read_lines(Path::new("word-list").join("shortened_list.txt")).await {

        let mut words: Vec<String> = vec![];
        let mut i: usize = 0;
        while let Ok(Some(line)) = lines.next_line().await {
            
            //println!("THE WORD IS: {}, LINE IS {}", &line, i);

            //skip all the lines which aren't part of the range
            if !((i >= usize::from(range_line.0)) && (i < usize::from(range_line.1))) {
                i+=1;
                continue;
            }

            //if the end of range is reached, return
            if i >= usize::from(range_line.1) {return words;}

            //println!("I can supposedly find this character in line... {}", i);

            let word_split = split(line.clone()).await;

            //println!("{:?}", word_split);

            if (
                {if let Some(starts_with) = &starts_with {word_split.get(0).unwrap().to_owned() == starts_with.to_owned()} else {true}}
                && {if let Some(ends_with) = &ends_with {word_split.get(word_split.len() - 1).unwrap().to_owned() == ends_with.to_owned()} else {true}}
                && {if let Some(middle_char) = &middle_char {word_split.get(2).unwrap().to_owned() == middle_char.to_owned()} else {true}}
            ) 
            {
                words.push(line);
            }

            i+=1;
        }

        return words;
    }

    vec![]
}

#[allow(dead_code)]
async fn find_one(prev_result: Option<FindOneCache>, starts_with: Option<String>, ends_with: Option<String>, middle_char: Option<String>) -> FindOneCache {

    #[allow(unused_assignments)]
    let mut list_choose: Vec<String> = vec![];

    if let Some(prev_result) = &prev_result {
        list_choose = (&(prev_result.original_list
                                .iter()
                                .cloned()
                                .collect::<HashSet<String>>())
                        
                        - &(prev_result.crossed_out
                            .iter()
                            .cloned()
                            .collect::<HashSet<String>>()))
                            
                    .iter()
                    .map(|x| x.to_owned())
                    .collect();
    } else {
        list_choose = find(starts_with, ends_with, middle_char).await;
    }

    if list_choose.len() == 0 {
        return FindOneCache::new(vec![], vec![], None);
    }

    let chosen = list_choose.choose(&mut rand::thread_rng()).unwrap().to_owned();
    if let Some(mut prev_result) = prev_result {
        prev_result.crossed_out.push(chosen.clone());
        prev_result.original_list = list_choose;
        prev_result.result = Some(chosen);

        return prev_result;
    }

    //println!("{}", &chosen);

    FindOneCache::new(list_choose, vec![chosen.clone()], Some(chosen))
}


#[allow(dead_code)]
async fn get_random_word(prev_result: Option<RandomCache>) -> Option<RandomCache>{
    
    let line_no = if let Some(prev_result) = &prev_result{
        let mut i = rand::thread_rng().gen_range(0..SHORTENED_LINES + 1);
        while prev_result.crossed_out.contains(&i) {
            i = rand::thread_rng().gen_range(0..SHORTENED_LINES + 1);
        }

        i
    } else {
        rand::thread_rng().gen_range(0..SHORTENED_LINES + 1)
    };

    if let Ok(mut lines) = read_lines(Path::new("word-list").join("shortened_list.txt")).await {

        let mut i:usize = 0;

        while let Ok(Some(mut line)) = lines.next_line().await {
            if i == usize::from(line_no) {
                if line.ends_with("\n") {
                    line = line[..line.len() - 1].to_owned();
                }

                if let Some(mut prev_result) = prev_result {
                    prev_result.crossed_out.push(line_no);
                    prev_result.result = Some(line);

                    return Some(prev_result);
                } else {
                    return Some(RandomCache::new(vec![line_no], Some(line)));
                }
            }

            i += 1;
        }
    }

    None
}


#[allow(dead_code)]
pub async fn create_board() -> Board{
    let tries = 400;

    let mut top: Option<RandomCache> = None;
    let mut right: Option<FindOneCache> = None;
    let mut left: Option<FindOneCache> = None;
    let mut down: Option<FindOneCache> = None;
    let mut vert: Option<FindOneCache> = None;
    let mut horz: Option<FindOneCache> = None;

    while (top == None)
            || (right == None)
            || (left == None)
            || (left == None)
            || (down == None)
            || (vert == None)
            || (horz == None) {
        right = None;
        left = None;
        down = None;
        vert = None;
        horz = None;

        //let mut top_retry = false;

        //println!("Top tried...");

        top = get_random_word(top.clone()).await;

        //println!("Top word chosen as: {}", top.clone().unwrap().result.unwrap());

        let top_split = split(top.clone().unwrap().result.unwrap()).await;

        //println!("Top split... {:#?}", &top_split);

        for _right_tries in 0..tries{

            let mut right_retry = false;

            left = None;
            down = None;
            vert = None;
            horz = None;

            right = Some(find_one(right, Some(top_split[4].clone()), None, None).await);

            //println!("Found right need to unpack...");

            if let Some(right) = right.clone() {
                if let None = right.result {
                    //println!("Continuing as right couldnt be unpacked");
                    continue;
                }
            }

            //println!("Trying right out as.. {}", right.clone().unwrap().result.unwrap());

            let right_split = split(right.clone().unwrap().result.unwrap()).await;

            for _left_retries in 0..tries {
                let mut left_retry = false;

                down = None;
                vert = None;
                horz = None;

                left = Some(find_one(left, Some(top_split[0].clone()), None, None).await);

                if let Some(left) = left.clone() {
                    if let None = left.result {
                        right_retry = true;
                        break;
                    }
                }
                let left_split = split(left.clone().unwrap().result.unwrap()).await;

                for _down_retries in 0..tries {
                    let mut down_retry = false;

                    vert = None;
                    horz = None;

                    down = Some(find_one(down, Some(left_split[4].clone()), Some(right_split[4].clone()), None).await);

                    if let Some(down) = down.clone() {
                        if let None = down.result {
                            left_retry = true;
                            break;
                        }
                    }
                    let down_split = split(down.clone().unwrap().result.unwrap()).await;

                    for _vert_retries in 0..tries {
                        let mut vert_retry = false;

                        horz = None;

                        vert = Some(find_one(vert, Some(top_split[2].clone()), Some(down_split[2].clone()), None).await);

                        if let Some(vert) = vert.clone() {
                            if let None = vert.result {
                                down_retry = true;
                                break;
                            }
                        }
                        let vert_split = split(vert.clone().unwrap().result.unwrap()).await;

                        for _horz_tries in 0..tries {

                            horz = Some(find_one(horz, Some(left_split[2].clone()), Some(right_split[2].clone()), Some(vert_split[2].clone())).await);

                            if let Some(horz) = horz.clone() {
                                if let None = horz.result {
                                    vert_retry = true;
                                    break;
                                }
                            }

                            //println!("horz chosen as.. {}", horz.clone().unwrap().result.unwrap());

                            break;
                        }

                        if !vert_retry {
                            break;
                        }
                    }

                    if !down_retry {
                        break;
                    }
                }

                if !left_retry {
                    break;
                }

            }

            if !right_retry {
                break;
            }
        }

    }

    (
        split(top.unwrap().result.unwrap()).await.try_into().unwrap(),
        split(right.unwrap().result.unwrap()).await.try_into().unwrap(), 
        split(left.unwrap().result.unwrap()).await.try_into().unwrap(),
        split(down.unwrap().result.unwrap()).await.try_into().unwrap(),
        split(vert.unwrap().result.unwrap()).await.try_into().unwrap(),
        split(horz.unwrap().result.unwrap()).await.try_into().unwrap()
    )

}