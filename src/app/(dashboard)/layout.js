"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchExpiryDates } from "@/redux/slice/expiryDatesSlice";

export default function Layout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpiryDates());
  }, [dispatch]);
  return <>{children}</>;
}
