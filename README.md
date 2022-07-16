
# [Obbattu](http://150.230.132.224:1845/)

### Obbattu is a kannada based wordle-like game.
<hr>
<br>

## Tech stack
- [Rust](https://www.rust-lang.org/) -> Backend server (using [***Rocket***](https://rocket.rs/) framework, Board generation)
- JS/HTML/CSS -> Frontend Webpages (using [***Svelte***](https://svelte.dev/) framework, Board display)

--

### Other various tools
- [Node](https://nodejs.org/en/)(Frontend, help with svelte)
- [Tokio](https://tokio.rs/)(Backend, async runtime)
- [AmoghUdupa's World List](https://github.com/amoghaUdupa/word-guessing-game/blob/main/src/constants/validGuesses.ts)(Kannada Word List)

<hr>
<br>

## Difficulties I faced along the way
- I faced many problems while trying to generate a board. A normal seach couldn't search 20K Words within the required time to generate every word for the whole board. I Had to write my own custom algorithm which caches search results and uses a tree structure which tries  to generate a branch for the board, and if it doesn't work out, it goes back a step and retries the previous branch with another cached value for its branch. [[board_generator.rs:280]](src/board_generator.rs#L280)

- Although there IS a library for drag and drop in svelte, the library doesnt give much info on what 'Item' has been dragged from where to where. I had to write a custom implementation for that. [[Letter.svelteContainer:17]](ObbattuFrontend/src/LetterContainer/LetterContainer.svelte#L17)

- Time. I did not know when to generate the board. I have cousins living in Australia and the US. When should the board/game be generated to give people living in AUS/IN/US the board at around the same time? Well, I thought of generating the board at midnight at UTC+14. Thats the earliest timezone, which gets the first sunlight in the whole world. Midnight UTC+14 is around 10AM UTC(1 day - utc+14's date). The backend stores 2 boards in its cache, and when a new board is generated, the last one is popped out of the cache. This allows the local user's client to get a board of their choice according to their local date. Hence everyone across the globe will get the same board on the same date.

<hr>
<br>

## What I Learnt
- I learnt many new technologies along the way, This was a small project to understand ***Rust***, one of the fastest compiled language which is capabale of competing with ***C++***. I used ***Rocket*** a small and lightweight server framework for rust, built on a tokio runtime, which allows asynchronous operations. I chose rocket over Actix and other rust server framework as rocket is very simple and easy to understand for beginners, and is somewhat closely related to [flask](https://flask.palletsprojects.com/en/2.1.x/), a python server framework I was mostly familiar with. Hence I found it very easy to use and learn Rocket.

- I started learning [React](https://reactjs.org/) a while back, and I found it a bit clunky. Me being more of a backend developer myself, im mostly familiar with Vanilla JS/HTML/CSS, and hence React and Node scared me. However while learning Svelte, it helped me breakdown each component on the webpage into separate files, and allowed me to use HTML, CSS and JS all in the same ".svelte" file. Svelte is far better than React for beginners and its probably the best framework out there for small (static/dynamic) websites. It compiles down to small HTML, JS, CSS files without any virtual DOMs like React.

- I'm mostly a programmer. I use windows as my daily OS, but when I needed to host the backend server on the VM, I needed to know how to work with VM instances, Linux, and other VPS stuff. I learnt a lot about hosting services, and how DNS records are written to connect to the hosted server ip. I also learnt a lot about Linux OS.

<!-- Whoah, who knew you could hide stuff in READMEs. TIL -->

## Helpers/Testers
- Myself
- My Father
- Close Friends
- Google/Youtube/StackOverflow
- [AmoghUdupa](https://twitter.com/amg_omg?lang=en)
- [SKYLIX Discord Server](https://skylix.net/)(website is still WIP)

## FAQ
- Why the name "Obbattu"?\
-> The english version of this game is called [waffle](https://wafflegame.net/), and I went with Obbattu as, well its also a sweet dish originated in Karnataka, and its also almost the same size of a waffle. Also its one of my favourite sweet dish.

- How many days of development did it take?\
-> Honestly, im not sure. I would say around ~15 days at max.

- How many other iterations of obbatu did you have while in dev?\
-> I had most of obbattu already designed(synchronously searching for words) in python, with a github repo named "Obbattu", but python was a bit slow for my need. I also wanted to learn rust, and hence I shifted to a github repo named OxidisedObbattu(as it was now being rewritten in rust).

- How many days will you keep the website running?\
-> Honestly, Im not sure. I will see how the site engagement is, and I will decide next year if i would want to continue to host it or not

- Does the website collect any type of user data?\
-> No. I dont collect any data, nor do I have any 3rd party services running in the background. There will be NO ads whatsoever. I do however collect info when a person successfully plays a game/wins a game, just for statistics(Everytime a person wins/looses a game, the server gets notified).

- What will you do if theres any kind of an attack on the server\
-> There mostly will not be any kind of attacks, i hope not. But even IF there is, I will be shutting down the server/VM for a while and boot it right back up!