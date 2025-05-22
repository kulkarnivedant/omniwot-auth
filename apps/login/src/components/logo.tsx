import Image from "next/image";

type Props = {
  height?: number;
  width?: number;
};

export function Logo({ height = 40, width = 147.5 }: Props) {
  return (
    <div>
      <Image
        height={height}
        width={width}
        src="/svg/omniwot-branding.svg"
        alt="logo"
        priority={true}
      />
    </div>
  );
}
