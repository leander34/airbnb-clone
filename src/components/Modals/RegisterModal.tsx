"use client";
import { useRegisterModal } from "@/store/useRegisterModal";
import Modal from "./Modal";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { useForm, SubmitHandler, FieldValue } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import { useLoginModal } from "@/store/useLoginModal";
const SchemaRegisterModal = z.object({
  name: z.string().nonempty(""),
  email: z.string().nonempty(""),
  password: z.string().nonempty(""),
});

type RegisterModalInputs = z.infer<typeof SchemaRegisterModal>;
const RegisterModal = () => {
  const { isOpen, onClose, onOpen } = useRegisterModal();
  const loginModal = useLoginModal();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterModalInputs>({
    resolver: zodResolver(SchemaRegisterModal),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const submit: SubmitHandler<RegisterModalInputs> = async (data) => {
    try {
      await axios.post("/api/register", data);
      toast.success("Success");
      onClose();
      loginModal.onOpen();
      toast.success("Register");
    } catch (error) {
      toast.error("Register error.");
    }
  };

  const toggle = useCallback(() => {
    onClose();
    loginModal.onOpen();
  }, [onClose, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isSubmitting}
        errors={errors}
        register={register}
        required
      />
      <Input
        id="name"
        label="Name"
        type="text"
        disabled={isSubmitting}
        errors={errors}
        register={register}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isSubmitting}
        errors={errors}
        register={register}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Already have an account?</div>
          <div
            className="text-neutral-800 cursor-pointer hover:underline"
            onClick={toggle}
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isSubmitting}
      isOpen={isOpen}
      onClose={onClose}
      title="Register"
      actionLabel="Continue"
      onSubmit={handleSubmit(submit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
