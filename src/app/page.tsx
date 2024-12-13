"use client";

import { useEffect, useState } from "react";
import Overview from "./overview/page";
import SignIn from "./auth/signin/page";

export default function Home() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Access localStorage only in the client-side
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  return (
    <>
      {userId ? <Overview /> : <SignIn />}
    </>
  );
}
