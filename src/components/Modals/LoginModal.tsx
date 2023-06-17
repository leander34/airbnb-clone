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
import { useLoginModal } from "@/store/useLoginModal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const SchemaLoginModal = z.object({
  email: z.string().nonempty(""),
  password: z.string().nonempty(""),
});

type LoginModalInputs = z.infer<typeof SchemaLoginModal>;
const LoginModal = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useLoginModal();
  const registerModal = useRegisterModal();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginModalInputs>({
    resolver: zodResolver(SchemaLoginModal),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit: SubmitHandler<LoginModalInputs> = async (data) => {
    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (response?.ok) {
        toast.success("Logged in");
        router.refresh();
        onClose();
        return;
      }

      if (response?.error) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("");
    }
  };

  const toggle = useCallback(() => {
    onClose();
    registerModal.onOpen();
  }, [onClose, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
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
        id="password"
        type="password"
        label="Password"
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
          <div>First time using Airbnb?</div>
          <div
            className="text-neutral-800 cursor-pointer hover:underline"
            onClick={toggle}
          >
            Create an account
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
      title="Login"
      actionLabel="Continue"
      onSubmit={handleSubmit(submit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
