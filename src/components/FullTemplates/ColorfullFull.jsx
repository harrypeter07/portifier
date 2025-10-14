"use client";

import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import CustomSliceZone from "./colorfull/src/components/CustomSliceZone";
import { mapSchemaToSlices } from "./colorfull/src/lib/schemaMapper";
import "./colorfull/src/app/globals.css";

export default function ColorfullFull({ data = EMPTY_PORTFOLIO }) {
	const slices = mapSchemaToSlices(data);
	return <CustomSliceZone slices={slices} />;
}


