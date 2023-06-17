"use client";

import { useRentModal } from "@/store/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../Navbar/Cateogories";
import CategoryInput from "../Inputs/CategoryInput";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CountrySelect from "../Inputs/CountrySelect";
import Map from "../Map";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const SchemaRentForm = z.object({
  category: z.string().nonempty(),
  location: z.object({
    flag: z.string().nonempty(),
    label: z.string().nonempty(),
    latlng: z.number().array(),
    region: z.string().nonempty(),
    value: z.string().nonempty(),
  }),
  guestCount: z.number().positive(),
  roomCount: z.number().positive(),
  bathroomCount: z.number().positive(),
  imageSrc: z.string().nonempty(),
  price: z.number().positive(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
});

type RentFormInputs = z.infer<typeof SchemaRentForm>;
const RentModal = () => {
  const { isOpen, onClose, onOpen } = useRentModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RentFormInputs>({
    resolver: zodResolver(SchemaRentForm),
    defaultValues: {
      category: "",
      location: undefined,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: keyof RentFormInputs, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((state) => state - 1);
  };

  const onNext = () => {
    setStep((state) => state + 1);
  };

  const onSubmit: SubmitHandler<RentFormInputs> = async (data) => {
    if (step !== STEPS.PRICE) {
      return;
    }

    try {
      console.log(data);
      await axios.post("/api/listings", data);
      toast.success("Listing created!");
      router.refresh();
      reset();
      setStep(STEPS.CATEGORY);
      onClose();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label}>
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guest find you!"
        />

        <CountrySelect
          onChange={(country) => setCustomValue("location", country)}
          value={location}
        />

        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Shere some basics about your place"
          subtitle="What amenities do you have?"
        />

        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="how would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          required
          type="text"
        />
        <hr />
        <Input
          id="description"
          label="Title"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          required
          type="text"
        />
      </div>
    );
  }

  if (step == STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        // reset();
        // setStep(1)
      }}
      title="Airbnb your home!"
      onSubmit={step === STEPS.PRICE ? handleSubmit(onSubmit) : onNext}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RentModal;
