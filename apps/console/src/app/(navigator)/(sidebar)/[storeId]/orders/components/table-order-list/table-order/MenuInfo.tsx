type MenuInfo = {
  menuName: string;
  quantity: number;
};

export default function MenuInfo({ menuName, quantity }: MenuInfo) {
  return (
    <div className="flex justify-between text-sm/5">
      <p>{menuName}</p>
      <p className="tabular-nums">{quantity}</p>
    </div>
  );
}
