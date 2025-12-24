"use client";

import React, { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

interface Favourite {
  id: number;
  coursename: string;
  course_short_description: string;
  image?: string;
  button_action: ReactNode;
}

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail);
      fetchFavourites(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavourites = async (userEmail: string) => {
    try {
      const res = await axios.get(
        `https://backstagepass.co.in/reactapi/get_favourite_course.php?email=${encodeURIComponent(
          userEmail
        )}`
      );

      if (res.data?.status === "success") {
        setFavourites(res.data.favourites ?? []);
      } else {
        setFavourites([]);
      }
    } catch (error) {
      console.error("Failed to load favourites", error);
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CARD ================= */
  const FavouriteCard = ({ fav }: { fav: Favourite }) => (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={
              fav.image
                ? `https://backstagepass.co.in/websiteadmin/uploads/featuredcourses/${fav.image}`
                : "https://source.unsplash.com/300x300/?education,course"
            }
            alt={fav.coursename}
            fill
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 leading-snug">
              {fav.coursename}
            </h4>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {fav.course_short_description}
            </p>
          </div>

          {/* ACTION */}
          <div className="mt-4">
            <Link
              href={`/coursedetails/${fav.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              {fav.button_action}
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">My Favourites</h2>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#E11D2E]" />
      <p className="text-sm font-medium text-gray-600">
        Loading favourites...
      </p>
    </div>
      ) : favourites.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center rounded-xl border bg-gray-50 p-10 text-center">
          <p className="text-lg font-semibold text-gray-700">
            No favourites yet ❤️
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Add courses to favourites and they’ll appear here.
          </p>
        </div>
      ) : (
        /* LIST */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {favourites.map((fav) => (
            <FavouriteCard key={fav.id} fav={fav} />
          ))}
        </div>
      )}
    </div>
  );
}
