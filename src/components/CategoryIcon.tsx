import React from 'react';
import {
  UtensilsCrossed,
  Coffee,
  ShoppingCart,
  Car,
  ShoppingBag,
  Home,
  HeartPulse,
  Film,
  Gift,
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Coins,
  PiggyBank,
  Tag,
  CreditCard,
  Building,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  icon?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, icon, className = 'w-5 h-5' }) => {
  const iconKey = (icon || name).toLowerCase();

  if (iconKey.includes('식비') || iconKey.includes('utensils')) return <UtensilsCrossed className={className} />;
  if (iconKey.includes('카페') || iconKey.includes('간식') || iconKey.includes('coffee')) return <Coffee className={className} />;
  if (iconKey.includes('마트') || iconKey.includes('편의점') || iconKey.includes('cart')) return <ShoppingCart className={className} />;
  if (iconKey.includes('교통') || iconKey.includes('차량') || iconKey.includes('car')) return <Car className={className} />;
  if (iconKey.includes('쇼핑') || iconKey.includes('의류') || iconKey.includes('bag')) return <ShoppingBag className={className} />;
  if (iconKey.includes('주거') || iconKey.includes('통신') || iconKey.includes('home')) return <Home className={className} />;
  if (iconKey.includes('의료') || iconKey.includes('건강') || iconKey.includes('heart')) return <HeartPulse className={className} />;
  if (iconKey.includes('문화') || iconKey.includes('여가') || iconKey.includes('film')) return <Film className={className} />;
  if (iconKey.includes('경조사') || iconKey.includes('선물') || iconKey.includes('gift')) return <Gift className={className} />;
  if (iconKey.includes('급여') || iconKey.includes('월급') || iconKey.includes('wallet')) return <Wallet className={className} />;
  if (iconKey.includes('부수입') || iconKey.includes('trending')) return <TrendingUp className={className} />;
  if (iconKey.includes('용돈') || iconKey.includes('coins')) return <Coins className={className} />;
  if (iconKey.includes('금융') || iconKey.includes('piggy')) return <PiggyBank className={className} />;
  if (iconKey.includes('카드') || iconKey.includes('credit')) return <CreditCard className={className} />;
  if (iconKey.includes('은행') || iconKey.includes('building')) return <Building className={className} />;

  return <Tag className={className} />;
};
