"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";

import Button from "../Button";
import InputText from "../InputText";

import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";

interface MenuCreateProfileProps {
  firebaseId: string;
}

interface FormData {
  username: string;
}

const MenuCreateProfile = ({ firebaseId }: MenuCreateProfileProps) => {
  const router = useRouter();
  const { dispatch, state } = useGlobalContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: "onChange", // Validate on every change
    defaultValues: {
      username: "",
    },
  });

  // Set initial value from global state
  useEffect(() => {
    if (state.username) {
      setValue("username", state.username);
    }
  }, [state.username, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/create-profile/${firebaseId}`,
        { username: data.username.trim() }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Validate response structure
      if (data?.profile) {
        dispatch({
          type: "SET_PROFILE",
          payload: data.profile,
        });
      }

      dispatch({
        type: "SET_MENU",
        payload: null,
      });

      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to create profile:", error);
      // Could add user-facing error handling here
    },
    retry: 1,
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // Watch username for real-time updates
  const watchedUsername = watch("username");

  return (
    <div className={style.signUp}>
      {/* Error feedback */}
      {mutation.isError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to create profile. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          className={style.inputText}
          type="text"
          placeholder="Enter Username (3-20 characters, letters/numbers only)"
          maxLength={20}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long",
            },
            maxLength: {
              value: 20,
              message: "Username must be no more than 20 characters long",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message:
                "Username can only contain letters, numbers, underscores, and hyphens",
            },
            validate: (value) => {
              const trimmed = value.trim();
              if (trimmed !== value) {
                return "Username cannot have leading or trailing spaces";
              }
              return true;
            },
          })}
        />

        {/* Username validation feedback */}
        {errors.username && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
            {errors.username.message}
          </div>
        )}

        <Button
          type="submit"
          variant={"primary"}
          disabled={!isValid || mutation.isPending || !watchedUsername?.trim()}
        >
          {mutation.isPending ? "Creating..." : "Create Profile"}
        </Button>
      </form>
    </div>
  );
};

export default MenuCreateProfile;
