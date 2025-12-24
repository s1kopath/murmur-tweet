import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMurmurDto {
  @IsNotEmpty()
  @MaxLength(280)
  text!: string;
}

