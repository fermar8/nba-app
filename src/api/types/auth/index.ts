export interface UserBasic {
	name: string;
	email: string;
	password: string;
}

export interface UserToFront extends Omit<UserBasic, 'password'> {
	teams: any;
	leagues: any;
	createdAt: Date;
	_id: string;
}

export interface UserComplete extends UserBasic {
	teams: any;
	leagues: any;
	createdAt: Date;
	_id: string;
}



export type UserData = UserBasic | UserComplete | UserToFront;