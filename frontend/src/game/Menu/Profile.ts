import { Menu, type ElementUI, type Rectangle, Game, Player } from "@/game";
import { userStore, type Historic } from "@/stores/userStore";

//Audio
import sound_close_tab from "@/assets/audio/close.mp3";
import { skin, TypeSkin } from "../ping_pong/Skin";

import { AnimationMenu } from "./AnimationMenu";
import { PaginationMenu } from "./PaginationMenu";

import avatarDefault from "@/assets/images/pingpong/avatar_default.jpg";
import friendImage from "@/assets/images/lobby/menu/friend.png";
import yourFriendImage from "@/assets/images/lobby/menu/your_friend.png";
import messageImage from "@/assets/images/lobby/menu/message.png";

export class Profile {
	private _menu = new Menu({ layer: "Global", isFocus: true });
	
	private radius: number = 10;
	private background: ElementUI = this.createBackground();	
	  
  	private your_user = userStore().user;
	private user: any;
	
  	//private getProfile = userStore().getUserProfile;
	//private player: Player;
	private avatarImage = new Image();
	private skinPaddle: any;

	private isYourFriend: boolean = false;
	private heSendARequestFriend: boolean = false;

	private isBlocked : boolean = false;

	//private matche_pagination: PaginationMenu;

	constructor(player_id: number) {

		this.fetchUser(player_id);
		//this.player = player;
	}

	async fetchUser(player_id: number) {
		try {
			this.user = await userStore().getUserProfile(player_id);
			
			await userStore().getFriends();
			await userStore().getFriendRequests();

			this.avatarImage.src = this.user.image ? this.user.image : avatarDefault;

			this.skinPaddle = skin.get_skin(TypeSkin.Paddle + "_" + this.user.paddleSkinEquipped);

			this.menu.add(this.background);
			this.menu.add(this.background, this.createButtonExit(33.5, 6));



			let index = this.your_user.friends.findIndex((friendship) => friendship.id === this.user.id);
			this.isYourFriend = index == -1 ? false : true;
			
			index = this.your_user.friendsRequests.findIndex((friendship) => friendship.requestorId === this.user.id);
			this.heSendARequestFriend = index == -1 ? false : true;

			index = this.your_user.friendsRequests.findIndex((friendship) => friendship.requesteeId === this.user.id);
			let friend = this.isYourFriend ? "-" : (this.heSendARequestFriend ? "0" : (index == -1 ? "+" : "-"));
			
			this.menu.add(this.background, this.createButtonAddFriend("add_friend", 10.5, 22.5, friend));
			
			this.menu.add(this.background, this.createButton("challenge", 3.25, 26, "Challenge", 9));
			this.menu.add(this.background, this.createButton("send_message", 13.25, 26, "Send Message", 9));

			index = this.your_user.block.findIndex((block) => block.blockedId == this.user.id);
			this.isBlocked = index == -1 ? false : true;
			console.log("is Block: ", this.isBlocked)

			this.menu.add(this.background, this.createButton("block", 23.25, 26, "Block", 9));
		
			//TODO Match
			//this.matche_pagination = new PaginationMenu([], 4, 2, this.background, this.menu);

    		//Arrow Buttons
    		/*this.menu.add(this.background, this.matche_pagination.createArrowButton("left", 2.5, 33.5, 2));
    		this.menu.add(this.background, this.matche_pagination.createArrowButton("right", 30.5, 33.5, 2));

			const squareW = 10;
    		const squareH = 8;
    		const paddingX = 6;
    		const paddingY = 12;

    		let page = 0;

    		this.user.infoPong.historic.forEach((matche: any, index: number) => {
    		  if ((index == 0 ? index + 1 : index) % this.matche_pagination.max_for_page == 0) page++;

    		  const i = index - page * this.matche_pagination.max_for_page;

    		  const squareX = 1 + (i % this.matche_pagination.max_for_line) * (squareW + paddingX);
    		  const squareY = 30 + paddingY + Math.floor(i / this.matche_pagination.max_for_line) * (squareH + paddingY);
    		  this.menu.add(this.background, this.createMatches(index, matche, squareX, squareY));
    		});*/

	
		} catch (error) {
			console.error('Erro ao buscar os usuários:', error);
			this.menu.close();
		}
	  }

	private createMatches(index: number, matche: Historic, x: number, y: number): ElementUI {

		const player1Image = new Image();
		const player2Image = new Image();

		const product: ElementUI = {
		  type: "image",
		  rectangle: { x: x + "%", y: y + "%", w: "15%", h: "15%" },
		  draw: (ctx: CanvasRenderingContext2D) => {

			/*if (!(this.matche_pagination.isIndexInCurrentPage(index))) {
				if (product.enable)
				  product.enable = false;
				return;
			  }*/
			if (!product.enable)
				product.enable = true;

			const offSetTittle = this.background.rectangle.y * 1.75;
	
			ctx.fillStyle = "silver";
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 2;
	
			this.roundRect(ctx, product.parent?.rectangle.x + product.rectangle.x, product.rectangle.y, product.rectangle.w, product.rectangle.h, this.radius);
	
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#000";
			ctx.font = "20px 'Press Start 2P', cursive";

			ctx.fillText(matche.result, product.parent?.rectangle.x + 
			product.rectangle.x + product.rectangle.w / 2.625, product.rectangle.y + offSetTittle, product.rectangle.w * 0.25);

			ctx.fillText(matche.player1, product.parent?.rectangle.x + 
				product.rectangle.x + product.rectangle.w * 0.05, product.rectangle.y + product.rectangle.h * 0.9, product.rectangle.w * 0.3);

			ctx.fillText(matche.player2, product.parent?.rectangle.x + 
				product.rectangle.x + product.rectangle.w * 0.65, product.rectangle.y + product.rectangle.h * 0.9, product.rectangle.w * 0.3);
		  
			 // matche.player1 
			player1Image.src = matche.player1 == this.user.nickname ? this.user.image : avatarDefault;
			player2Image.src = matche.player2 == this.user.nickname ? this.user.image : avatarDefault;

			ctx.strokeRect(product.parent?.rectangle.x + product.rectangle.x + product.rectangle.w * 0.095, product.rectangle.y + product.rectangle.h * 0.3, product.rectangle.w * 0.20, product.rectangle.h * 0.35);
			ctx.strokeRect(product.parent?.rectangle.x + (product.rectangle.x + product.rectangle.w) - (product.rectangle.w * 0.295), product.rectangle.y + product.rectangle.h * 0.3, product.rectangle.w * 0.20, product.rectangle.h * 0.35);

			ctx.drawImage(player2Image, product.parent?.rectangle.x + product.rectangle.x + product.rectangle.w * 0.095, product.rectangle.y + product.rectangle.h * 0.3, product.rectangle.w * 0.20, product.rectangle.h * 0.35);
			ctx.drawImage(player2Image, product.parent?.rectangle.x + (product.rectangle.x + product.rectangle.w) - (product.rectangle.w * 0.295), product.rectangle.y + product.rectangle.h * 0.3, product.rectangle.w * 0.20, product.rectangle.h * 0.35);

			/*if (player1Image.complete) 
			else {
				player1Image.src = avatarDefault;
				ctx.drawImage(player1Image, product.rectangle.x + product.parent?.rectangle.w * 0.5, product.rectangle.y, product.rectangle.w, product.rectangle.h);
			}*/

			/*if (player2Image.complete) ctx.drawImage(player2Image, product.rectangle.x + this.background.rectangle.x * 0.25, product.rectangle.y, this.background.rectangle.x * 2, this.background.rectangle.y * 1.75);
			else {
				player2Image.src = avatarDefault;
				ctx.drawImage(player2Image, product.rectangle.w - this.background.rectangle.x * 1.25, product.rectangle.y, this.background.rectangle.x * 2, this.background.rectangle.y * 1.75);
			}*/
			ctx.lineWidth = 5;
			ctx.strokeText(matche.winner == this.user.nickname ? "WIN!" : "LOSE.", product.parent?.rectangle.x + 
				product.rectangle.x + product.rectangle.w * 0.35, product.rectangle.y + product.rectangle.h * 0.12, product.rectangle.w * 0.3)
			ctx.fillStyle = matche.winner == this.user.nickname ? "gold" : "grey";
			ctx.fillText(matche.winner == this.user.nickname ? "WIN!" : "LOSE.", product.parent?.rectangle.x + 
				product.rectangle.x + product.rectangle.w * 0.35, product.rectangle.y + product.rectangle.h * 0.12, product.rectangle.w * 0.3);
			
		},
		  onClick: () => {
			//if (!(this.matche_pagination.isIndexInCurrentPage(index))) return ;
			//DO SOMETHING
		  },
		};
		return product;
	}	

	private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
	  const r = x + width;
	  const b = y + height;
	  ctx.beginPath();
	  ctx.moveTo(x + radius, y);
	  ctx.lineTo(r - radius, y);
	  ctx.quadraticCurveTo(r, y, r, y + radius);
	  ctx.lineTo(r, y + height - radius);
	  ctx.quadraticCurveTo(r, b, r - radius, b);
	  ctx.lineTo(x + radius, b);
	  ctx.quadraticCurveTo(x, b, x, b - radius);
	  ctx.lineTo(x, y + radius);
	  ctx.quadraticCurveTo(x, y, x + radius, y);
	  ctx.closePath();
	}

	private createBackground(): ElementUI {
		/*const animation = new AnimationMenu();
		let animation_finish = false;*/
	  	const background: ElementUI = {
			type: "image",
			rectangle: { x: "0%", y: "5%", w: "35%", h: "75%" },
			draw: (context: any) => {
				this.drawBackground(context, background.rectangle);
				//animation_finish = animation.animation(background.rectangle.x - background.rectangle.w, background.rectangle.x, 0, background);
				
			},
	  	};
	  	return background;
	}

	private createButton(type: string, x: number, y: number, label: string, width: number): ElementUI {
	  let color = "black";
	  const button: ElementUI = {
		type: type,
		rectangle: { x: x + "%", y: y + "%", w: width + "%", h: "4.5%" },
		draw: (ctx: CanvasRenderingContext2D) => {
		
			if (type == "block")
				label = this.isBlocked ? "Unblock" : "Block";

			ctx.fillStyle = "white";
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;

			this.roundRect(ctx, button.parent?.rectangle.x + button.rectangle.x, button.rectangle.y, button.rectangle.w, button.rectangle.h, this.radius);

			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "black";
			ctx.font = "10px 'Press Start 2P', cursive";

			const begin = button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.1;
			const max_with = button.rectangle.w - (button.rectangle.w * 0.2);

			let offset = 0;
			let offsetmax = 0;
			const labelWidth = ctx.measureText(label).width;
			while (begin + offset + labelWidth < begin + max_with - offset)
			{
				offsetmax += button.rectangle.w * 0.05;
				if (begin + offsetmax + labelWidth > begin + max_with - offset)
					break ;
				offset = offsetmax;
			}

			ctx.fillText(label, 
			button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.1 + offset,
			button.rectangle.y + button.rectangle.h / 2 + 6, 
			button.rectangle.w - (button.rectangle.w * 0.2) - offset);
			},
			onClick: () => {
			if (type == "challenge") {
				//TODO Created table and send challenge
				/*const confirmButton = new CreateGame(this.player);
				confirmButton.show((value) => {
				if (value == "CONFIRM") buy_sound.play();
					}); */
			}
			else if (type == "send_message") {
				//TODO DATABASE 
				//Send Private Message
			  	//TODO send priv message
			}
			else if (type == "block") {

				if (this.isBlocked)
				{
					userStore().unblockUser(this.user.id);
					this.isBlocked = false;
				}
				else
				{
					userStore().blockUser(this.user.id);
					this.isBlocked = true;
				}
			}
		},
	  };
	  return button;
	}

	private createButtonAddFriend(type: string, x: number, y: number, label: string): ElementUI {

		const friendImg = new Image();
		friendImg.src = friendImage;
		const yourFriendImg = new Image();
		yourFriendImg.src = yourFriendImage;
		const msgImg = new Image();
		msgImg.src = messageImage;
		const button: ElementUI = {
			type: type,
			rectangle: { x: x + "%", y: y + "%", w: "4%", h: "2.5%" },
			draw: (ctx: CanvasRenderingContext2D) => {
				ctx.fillStyle = this.isYourFriend ? "orange" : (this.heSendARequestFriend ? "grey" : (label == "+" ? "green" : "red"));
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				const labelFriend = this.isYourFriend ? "Remove Friend" : (this.heSendARequestFriend ? "You have a Request" : (label == "+" ? "Add Friend" : "Cancel Request"));

				
				this.roundRect(ctx, button.parent?.rectangle.x + button.rectangle.x, button.rectangle.y, button.rectangle.w, button.rectangle.h, this.radius);
				ctx.fill();
				ctx.stroke();
				
				if (this.isYourFriend)
				{
					if (yourFriendImg.complete)
						ctx.drawImage(yourFriendImg, button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.1, button.rectangle.y + button.rectangle.h * 0.05, button.rectangle.w * 0.525, button.rectangle.h * 0.925);
				}
				else
				{
					if (friendImg.complete)
						ctx.drawImage(friendImg, button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.1, button.rectangle.y, button.rectangle.w * 0.5, button.rectangle.h);
				}
		
				ctx.fillStyle = "black";
				ctx.font = "10px 'Press Start 2P', cursive";

				if (this.heSendARequestFriend)
				{
					if (msgImg.complete)
						ctx.drawImage(msgImg, button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.5, button.rectangle.y + button.rectangle.h * 0.05, button.rectangle.w * 0.4, button.rectangle.h * 0.925);
				}
				else
					ctx.fillText(label, button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 0.7, button.rectangle.y + button.rectangle.h / 2 + 6);
			
				ctx.fillText(labelFriend, button.parent?.rectangle.x + button.rectangle.x + button.rectangle.w * 1.1, button.rectangle.y + button.rectangle.h / 2 + 6, button.rectangle.w * 1.25);
			},
			onClick: () => {

				if (!this.isYourFriend) //Not Friend
				{
					if (label == "+") {
						userStore().sendFriendRequest(this.user.id);
						label = "-";
					}
					else if (label == "-") {
						userStore().cancelFriendRequest(this.user.id);
						label = "+";
					}
				}
				else //Friend
				{
					if (label == "-") {
						userStore().deleteFriend(this.user.id);
						label = "+";
						this.isYourFriend = false;
					}
				}
			},
	  };
	  return button;
	}

	private drawBackground(ctx: CanvasRenderingContext2D, pos: Rectangle) {
	  const backgroundColor = "rgba(210, 180, 140, 0.6)";
	  const borderColor = "black";

	  ctx.fillStyle = backgroundColor;
	  this.roundRect(ctx, pos.x, pos.y, pos.w, pos.h, this.radius);
	  ctx.fill();

	  ctx.strokeStyle = borderColor;
	  ctx.lineWidth = 2;
	  ctx.stroke();

	  
    //NickName
    ctx.fillStyle = 'black';
    ctx.font = "22px 'Press Start 2P', cursive";
	  ctx.fillText(this.user.nickname, pos.x + pos.w * 0.30, pos.y + pos.h * 0.10, pos.w - (pos.x + pos.w * 0.5));

    //Level
    ctx.font = "12px 'Press Start 2P', cursive";
	ctx.fillText("Level: " + this.user.level, pos.x + pos.w * 0.30, pos.y + pos.h * 0.13, pos.w - (pos.x + pos.w * 0.5));

	//Money
	ctx.fillText("Money: " + this.user.money + "₳", pos.x + pos.w * 0.30, pos.y + pos.h * 0.16, pos.w - (pos.x + pos.w * 0.5));
    
	//Level
	/*const wins = this.user.infoPong.historic.filter((history: any) => history.winner == this.user.nickname).length;
	ctx.fillText("Wins:  " + wins, pos.x + pos.w * 0.30, pos.y + pos.h * 0.19, pos.w - (pos.x + pos.w * 0.5));

	const loses = this.user.infoPong.historic.filter((history: any) => history.loser == this.user.nickname).length
	ctx.fillText("Loses: " + loses, pos.x + pos.w * 0.30, pos.y + pos.h * 0.22, pos.w - (pos.x + pos.w * 0.5));
*/
	ctx.fillText("Wins:  ", pos.x + pos.w * 0.30, pos.y + pos.h * 0.19, pos.w - (pos.x + pos.w * 0.5));
	ctx.fillText("Loses: ", pos.x + pos.w * 0.30, pos.y + pos.h * 0.22, pos.w - (pos.x + pos.w * 0.5));
    //Avatar

	ctx.strokeStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeRect(
      pos.x + pos.w * 0.05, 
      pos.y + pos.h * 0.05,
      pos.w * 0.2,
      pos.h * 0.2,
      );

	  try {
		ctx.drawImage(this.avatarImage, pos.x + pos.w * 0.05, 
			pos.y + pos.h * 0.05,
			pos.w * 0.2,
			pos.h * 0.2,);
	  }
	  catch {
		this.avatarImage.src = avatarDefault;
		ctx.drawImage(this.avatarImage, pos.x + pos.w * 0.05, 
			pos.y + pos.h * 0.05,
			pos.w * 0.2,
			pos.h * 0.2,);
	  }

		//Paddle
		const scale = 100 / 30;
        const scaledWidth = pos.w * 0.035 * scale;
        const scaledHeight = pos.h * 0.055 * scale;
        const pointx = (pos.w - pos.w * 0.15);
        const pointy = (pos.h* 0.07);
        
        ctx.fillStyle = this.user.color;
        ctx.fillRect(pos.x + pointx, pos.y + pointy, scaledWidth * 0.5, scaledHeight * 0.9);
      

        if (this.skinPaddle.complete) {
          ctx.drawImage(this.skinPaddle, pos.x + pointx, pos.y + pointy, scaledWidth * 0.5, scaledHeight * 0.9);
        }
          
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(pos.x + pointx, pos.y + pointy, scaledWidth * 0.5, scaledHeight * 0.9);
 

	  //Matches
	  ctx.font = "22px 'Press Start 2P', cursive";
	  ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
	  ctx.strokeText("Matches", pos.x + pos.w * 0.35, pos.y + pos.h * 0.425, pos.w * 0.275);

	  ctx.lineWidth = 3;

      ctx.fillStyle = "white";
	  ctx.fillText("Matches", pos.x + pos.w * 0.35, pos.y + pos.h * 0.425, pos.w * 0.275);
        
    /*if (this.avataresImage.complete) ctx.drawImage(this.avataresImage, 
      ((this.chooseAvatar - 4 >= 0 ? this.chooseAvatar - 4 : this.chooseAvatar) * 144) + 48, //+3
      (this.chooseAvatar - 4 >= 0 ? 1 : 0) * 320, //+4
      48, 80,
      pos.x + pos.w * 0.05, 
      pos.y + pos.h * 0.04,
      pos.w * 0.4,
      pos.h * 0.80);*/
	}

	private createButtonExit(x: number, y: number): ElementUI {
	  const close_tab = new Audio(sound_close_tab);
	  const button: ElementUI = {
		type: "exit",
		rectangle: { x: x + "%", y: y + "%", w: "1%", h: "2%" },
		draw: (ctx: CanvasRenderingContext2D) => {
		  ctx.fillStyle = "red";
		  ctx.strokeStyle = "black";
		  ctx.fillRect(button.parent?.rectangle.x + button.rectangle.x, button.rectangle.y, button.rectangle.w, button.rectangle.h);
		  ctx.strokeRect(button.parent?.rectangle.x + button.rectangle.x, button.rectangle.y, button.rectangle.w, button.rectangle.h);

		  ctx.lineWidth = 3;

		  ctx.beginPath();
		  ctx.moveTo(button.parent?.rectangle.x + button.rectangle.x + 5, button.rectangle.y + 5);
		  ctx.lineTo(button.parent?.rectangle.x + button.rectangle.x + 5 + button.rectangle.w - 10, button.rectangle.y + 5 + button.rectangle.h - 10);
		  ctx.stroke();

		  ctx.beginPath();
		  ctx.moveTo(button.parent?.rectangle.x + button.rectangle.x + 5, button.rectangle.y + 5 + button.rectangle.h - 10);
		  ctx.lineTo(button.parent?.rectangle.x + button.rectangle.x + 5 + button.rectangle.w - 10, button.rectangle.y + 5);
		  ctx.stroke();
		},
		onClick: () => {
		  close_tab.play();
		  this.menu.close();
		},
	  };
	  return button;
	}

	get menu(): Menu {
	  return this._menu;
	}

}