import { useMutation } from "@tanstack/react-query";
import { login, register } from "../services/auth";

export function AuthPlayground() {
  const { mutateAsync: doLogin } = useMutation({ mutationFn: login });
  const { mutateAsync: doRegister } = useMutation({ mutationFn: register });

  async function handleLogin() {
    try {
      const res = await doLogin({
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      });
      console.log("LOGIN token:", res.token);
    } catch (err) {
      console.error("Login error", err);
    }
  }

  async function handleRegister() {
    try {
      const res = await doRegister({
        email: "eve.holt@reqres.in",
        password: "pistol",
      });
      console.log("REGISTER id+token:", res);
    } catch (err) {
      console.error("Register error", err);
    }
  }

  return (
    <div>
      <button onClick={handleLogin}>Login Fake</button>
      <button onClick={handleRegister}>Register Fake</button>
    </div>
  );
}
