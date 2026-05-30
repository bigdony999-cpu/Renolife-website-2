export type Language = 'sw' | 'en';

export interface TranslationSet {
  navBenefits: string;
  navScience: string;
  navReviews: string;
  navBuyNow: string;
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  heroCTA: string;
  heroSecondary: string;
  benefitsTitle: string;
  benefitsSub: string;
  benefitsItems: {
    title: string;
    description: string;
    icon: string;
  }[];
  specTitle: string;
  specSub: string;
  specs: {
    label: string;
    value: string;
    description: string;
    icon: string;
  }[];
  reviewsTitle: string;
  reviewsSub: string;
  reviewsFilterAll: string;
  newsTitle: string;
  ingredientTitle: string;
  ingredientSub: string;
  ingredients: {
    name: string;
    sciName: string;
    desc: string;
    category: string;
  }[];
  orderModalTitle: string;
  orderFormName: string;
  orderFormPhone: string;
  orderFormAddress: string;
  orderFormQuantity: string;
  orderFormSubmit: string;
  orderFormSuccess: string;
  orderPriceCalc: string;
  currency: string;
  footerTerms: string;
  footerPrivacy: string;
  footerScience: string;
  footerWholesale: string;
  footerCopyright: string;
  submitReview: string;
  reviewPlaceholderName: string;
  reviewPlaceholderText: string;
  reviewRating: string;
  reviewCategoryLabel: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  category: 'general' | 'skin' | 'energy' | 'chronic';
  date: string;
}
