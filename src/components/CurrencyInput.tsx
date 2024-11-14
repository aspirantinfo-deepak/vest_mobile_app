import React from "react";
import { NumericFormat } from "react-number-format";

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  prefix: any;
  className: any;
  placeholder: any;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  prefix,
  className,
  placeholder,
}) => {
  return (
    <NumericFormat
      value={value}
      thousandSeparator=","
      decimalSeparator="."
      prefix={prefix}
      //   decimalScale={2}
      fixedDecimalScale={true}
      allowNegative={false}
      onValueChange={(values) => {
        const { floatValue } = values;
        if (floatValue !== undefined) {
          onChange(floatValue);
        }
      }}
      inputMode="numeric"
      pattern="[0-9]*"
      displayType="input"
      className={className}
      placeholder={placeholder}
    />
  );
};

export default CurrencyInput;
