/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import * as contentstack from "contentstack";
import * as Utils from "@contentstack/utils";

import ContentstackLivePreview from "@contentstack/live-preview-utils";

type GetEntry = {
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

const Stack = contentstack.Stack({
  api_key: `${process.env.REACT_APP_CONTENTSTACK_API_KEY}`,
  delivery_token: `${process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN}`,
  environment: `${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT}`,
  //@ts-ignore
  region: `${process.env.REACT_APP_CONTENTSTACK_REGION}`
    ? `${process.env.REACT_APP_CONTENTSTACK_REGION}`
    : "us",
  live_preview: {
    management_token: `${process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN}`
      ? `${process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN}`
      : "",
    enable: true,
    host: `${process.env.REACT_APP_CONTENTSTACK_API_HOST}`
      ? `${process.env.REACT_APP_CONTENTSTACK_API_HOST}`
      : "",
  },
});

/**
 * initialize live preview
 */
ContentstackLivePreview.init({
  enable: true,
  //@ts-ignore

  stackSdk: Stack,
  clientUrlParams: {
    host: `${process.env.REACT_APP_CONTENTSTACK_APP_HOST}`
      ? `${process.env.REACT_APP_CONTENTSTACK_APP_HOST}`
      : "",
  },
  editButton: {
    enable: true,
    exclude: ["outsideLivePreviewPortal"],
    includeByQueryParameter: false,
    position: "top-right",
  },

  ssr: false,
});

if (`${process.env.REACT_APP_CONTENTSTACK_API_HOST}`) {
  Stack.setHost(`${process.env.REACT_APP_CONTENTSTACK_API_HOST}`);
}

const renderOption = {
  ["span"]: (node: any, next: any) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }: GetEntry) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
  }: GetEntryByUrl) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      blogQuery.includeOwner().toJSON();
      const data = blogQuery.where("url", `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
