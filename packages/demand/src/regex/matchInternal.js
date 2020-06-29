import { PREFIX_MOCK, PREFIX_INTERNAL } from "../constant";

export default new RegExp("^(" + PREFIX_MOCK + "|" + PREFIX_INTERNAL + ")");
