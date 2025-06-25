import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";



interface JoinWorkspaceInputProps {
  value:string;
  disabled:boolean;
  onChange:(newValue:string) => unknown;
  onComplete:(newValue:string) => unknown;
}

export const JoinWorkspaceInput = ({value,disabled,onChange,onComplete}:JoinWorkspaceInputProps) => {
  return (
    <InputOTP disabled={disabled} autoFocus value={value} onChange={onChange} onComplete={onComplete} maxLength={6}>
      <InputOTPGroup >
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};
