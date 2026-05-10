export type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

export type Post = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

export type Comment = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
};
