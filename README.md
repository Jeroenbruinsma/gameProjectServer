# gameProjectServer
What part of the stack to do you think will be the hardest?
making funcions
Put everything in react/redux/ api
Project time is limited


What type of game you want to make and why?

We are planning on making a crocodile biting game. Players click on a tooht in a crocodile mouth and if they press the wrong one
the mouth closes and the player loses. If the player clicks on a non biting tooth the player get one point and the turn goes to 
the next player. 

It's a fun kids game, contains all the learning goals. And ofcourse we like crocodiles. 


What do your teammates need to know to work with youeffectively?
<Jeroen> My code is messy 
<Sooyoung> I'm slow
<Sooyoung> Can consentrate better at home


What parts of the work do you think you will be good at or enjoy?
<Sooyung> feel more confident is in backend wanna do frontend
<Jeroen> Enjoy playing the game, I just like programming, not making documentation

1. How many ”apps” will there be?
Frontend (React-redux) = 1 app
Backend (sequelize,router) = 1 app


2.  What will the database schema be?
	Users		id (auto increment by db)
			name	
			email (required)
			password (requiered)

	lobby		id (auto increment by db)
			gameName
			playerId (id from users)
			status (waiting for player, full, empty)

	GameStats	id (auto increment by db)
			lobbyId
			turns	
			playerWinner (id users) (null if no winner yet)


3.  What properties will the store have?

	the store has 
		tooth[ 	{ thooth1 = false(unclicked), biteTooth=false }, 
		       	{ thooth2 = true(clicked) biteTooth=false      },
			{ thooth3 = false, biteTooth=true }	 },
			{ thooth4 = true, biteTooth=false },
			...,
			{ thooth9 = false, biteTooth=false }

		    ]
		make_new_user -> login -> choose loby -> wait for 2nd player -> play -> winner -> login 

		actions player_get_name
			total_streak
			lobby_get_rooms 
			lobby_create_room
			lobby_enter_room
			game_tooth_clicked(toothnumber)
			login (username, password)
			signup(username,password, name, email)			
	
		reducers
			player_get_name
			total_streak
			lobby_get_rooms
			tooth_clicked(toothnumber )
			game_finished
			login
		

4.  What routes will be handled?

	localhost:5000/users
	localhost:5000/lobby
	localhost:5000/gamestats {playerIDTurn=xx }

5.  How will the files be structured?
	
	gameWeek / server / (sequelize project)
		 / client / (react project)



 

