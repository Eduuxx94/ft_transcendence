import { Transform } from "class-transformer";
import { IsNumber, IsNotEmpty, IsString, IsEmail } from "class-validator";

export class AuthDto {
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	image: string;
}