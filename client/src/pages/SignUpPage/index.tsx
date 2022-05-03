import { FC } from "react";

type SignUpPageProps = {};

export const SignUpPage: FC<SignUpPageProps> = () => (
  <div className="flex justify-center min-h-screen items-center gap-8 bg-base-200">
    <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body items-center">
        <h2 className="card-title">新規登録</h2>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Type here" className="input input-bordered input-primary" />
          <input type="text" placeholder="Type here" className="input input-bordered input-primary" />
          <div className="card-actions justify-center">
            <button className="btn btn-primary">登録</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
