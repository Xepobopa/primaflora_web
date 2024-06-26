export type TButtonProps = {
    text?: string;
    imageUrl?: string;
    onClick: () => void;
    backgroundColor?: string;
    style?: React.CSSProperties;
    filled?: boolean;
    small?: boolean;
    isClickable?: boolean;
    type?: "submit" | "reset" | "button";
};
