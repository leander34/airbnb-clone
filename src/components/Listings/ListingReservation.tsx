"use client";
import { Range } from "react-date-range";
import { boolean } from "zod";
import Calendar from "../Inputs/Calendar";
import Button from "../Button";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Required<Range>) => void;
  onSubmit: () => void;
  disabled: boolean;
  disabledDates: Date[];
}
const ListingReservation: React.FC<ListingReservationProps> = ({
  dateRange,
  disabled,
  disabledDates,
  onChangeDate,
  onSubmit,
  price,
  totalPrice,
}) => {
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-22xl font-semibold"> $ {price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />

      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection as Required<Range>)}
      />
      <hr />
      <div className="p-4">
        {" "}
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <div className="p-4 flex flex-row items-start justify-between font-semibold text-lg">
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
