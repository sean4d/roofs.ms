import type { ElementKey } from "@/components/estimator/house-svg";

/**
 * Estimator options.
 *
 * Every price here traces back to config/pricing.ts. Where a real price has
 * not been supplied, `price` is null and the option is presented as
 * "quoted after review" rather than given an invented number.
 *
 * `perFoot` options multiply by a length input; `perUnit` options multiply by
 * a count; `fixed` options are a single line item.
 */

export type OptionMode = "perFoot" | "perUnit" | "fixed";

export interface EstimatorOption {
  key: string;
  label: string;
  detail: string;
  /** Which part of the illustration lights up when selected. */
  element: ElementKey;
  mode: OptionMode;
  /** Dollars per foot / per unit / flat. Null means quote-only. */
  price: number | null;
  /** perFoot: default length. perUnit: default count when toggled on. */
  defaultQuantity: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  group: "roof" | "features" | "grounds";
}

export const ESTIMATOR_OPTIONS: EstimatorOption[] = [
  {
    key: "mainRoof",
    label: "Main roofline",
    detail: "The primary front-facing rooflines and eaves",
    element: "mainRoof",
    mode: "perFoot",
    price: 10,
    defaultQuantity: 120,
    min: 40,
    max: 400,
    step: 10,
    unit: "ft",
    group: "roof",
  },
  {
    key: "secondaryRoof",
    label: "Secondary rooflines",
    detail: "Upper gables, wings and returns",
    element: "secondaryRoof",
    mode: "perFoot",
    price: 10,
    defaultQuantity: 60,
    min: 0,
    max: 240,
    step: 10,
    unit: "ft",
    group: "roof",
  },
  {
    key: "peaks",
    label: "Peaks & ridges",
    detail: "Ridge accents at each apex",
    element: "peaks",
    mode: "perUnit",
    price: 85,
    defaultQuantity: 2,
    min: 0,
    max: 10,
    step: 1,
    unit: "peaks",
    group: "roof",
  },
  {
    key: "dormers",
    label: "Dormers",
    detail: "Individually outlined dormer windows",
    element: "dormers",
    mode: "perUnit",
    price: 120,
    defaultQuantity: 2,
    min: 0,
    max: 8,
    step: 1,
    unit: "dormers",
    group: "roof",
  },
  {
    key: "windows",
    label: "Window outlines",
    detail: "Priced by size, $100 to $400 each",
    element: "windows",
    mode: "perUnit",
    price: 250,
    defaultQuantity: 4,
    min: 0,
    max: 20,
    step: 1,
    unit: "windows",
    group: "features",
  },
  {
    key: "columns",
    label: "Wrapped columns",
    detail: "$10 per foot of column, about 10 ft each",
    element: "columns",
    mode: "perUnit",
    price: 100,
    defaultQuantity: 4,
    min: 0,
    max: 16,
    step: 1,
    unit: "columns",
    group: "features",
  },
  {
    key: "entry",
    label: "Entry & doorway",
    detail: "Front entry surround and door frame",
    element: "entry",
    mode: "fixed",
    price: 175,
    defaultQuantity: 1,
    group: "features",
  },
  {
    key: "pathway",
    label: "Pathway lighting",
    detail: "Ground stakes at $8 per foot of walkway",
    element: "pathway",
    mode: "perFoot",
    price: 8,
    defaultQuantity: 40,
    min: 0,
    max: 200,
    step: 10,
    unit: "ft",
    group: "grounds",
  },
  {
    key: "shrubs",
    label: "Shrub & bed lighting",
    detail: "Net-lit hedges and foundation beds",
    element: "shrubs",
    mode: "perUnit",
    price: 145,
    defaultQuantity: 4,
    min: 0,
    max: 20,
    step: 1,
    unit: "beds",
    group: "grounds",
  },
];

/** Tree sizes are their own control: they dominate a large display. */
export const TREE_OPTIONS = [
  { key: "small", label: "Small", detail: "Ornamental, up to ~15 ft", price: 1500 },
  { key: "medium", label: "Medium", detail: "Established shade tree", price: 2500 },
  { key: "large", label: "Large", detail: "Mature hardwood", price: 3500 },
  {
    key: "estate",
    label: "Estate / Specimen",
    detail: "Century live oak",
    price: null,
  },
] as const;

export const OPTION_GROUPS = [
  { key: "roof", label: "Roof & Architecture" },
  { key: "features", label: "Features" },
  { key: "grounds", label: "Grounds" },
] as const;
