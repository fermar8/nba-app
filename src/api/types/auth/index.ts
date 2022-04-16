export interface UserBasic {
	name: string;
	email: string;
	password: string;
}

export interface UserComplete extends UserBasic {
	createdAt: Date;
}


export type UserData = UserBasic | UserComplete;