import store from "../store/index";

export default async (to, from, next) => {
  document.title = to.name;

  if (to.name !== "login" && !store.getters["auth/hasToken"]) {
    try {
      await this.dispatch("auth/ActionCheckToken");

      next({ name: to.name });
    } catch (error) {
      next({ name: "login" });
    }
  } else {
    if (to.name === "login" && store.getters["auth/hasToken"]) {
      next({ name: "home" });
    } else {
      next();
    }
  }
  next();
};
