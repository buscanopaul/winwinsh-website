import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type V2_MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Header from '../../public/bg_header.png';
import Maintenance from '../../public/maintenance.png';
import Detailing from '../../public/detailing.png';
import Branded from '../../public/brands.png';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home bg-[length:20vw_20vw] background-grid">
      <HomeHeader />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} />
      <Services />
      <Brands />
    </div>
  );
}

function HomeHeader() {
  return (
    <div className="flex flex-col md:flex-row max-w-6xl px-5 mx-auto pt-20">
      <div className="pt-10 md:w-1/2 w-full">
        <h2 className="text-6xl">WinWish</h2>
        <h2 className="text-6xl">Auto Shop</h2>
        <p className="pt-5">
          In addition to our exceptional repair services, we offer an extensive
          selection of premium auto parts to help you keep your vehicle in top
          shape. From brakes and filters to batteries and more, our inventory is
          stocked with the finest products to meet your specific needs.
        </p>
        <Link to={'/'}>
          <p className="bg-[#FED550] max-w-[300px] text-center mt-10 text-xl p-3 border-[#0E1D2B] border-4 text-black">
            Start Shopping Now!
          </p>
        </Link>
      </div>
      <div className="md:w-1/2 w-full flex md:justify-end justify-center my-20 md:mt-0">
        <img src={Header} width={300} height={300} />
      </div>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  const image = collection.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products relative">
      <div className="bg-[#212326] absolute top-0 left-0 w-full h-full background-grid-gray bg-[length:10vw_10vw]" />
      <div className="max-w-6xl mx-auto px-5 py-20 relative">
        <h2 className="text-white text-3xl mb-10">Featured Products</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <div className="recommended-products-grid">
                {products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4 className="text-white">{product.title}</h4>
                    <small className="flex text-white gap-[3px]">
                      &#8369;
                      <Money
                        data={product.priceRange.minVariantPrice}
                        className="text-white"
                        withoutCurrency
                      />
                    </small>
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <h2 className="text-4xl mb-4 text-center md:text-left">
        Our Quality Services
      </h2>
      <p className="max-w-md mb-20 text-center md:text-left">
        Install the Hydrogen channel and get access to Oxygen deployments
      </p>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 w-full items-center flex flex-col text-center">
          <img src={Maintenance} width={350} height="100%" className="mb-10" />
          <h5 className="mb-5">Preventive Maintenance Schedule</h5>
          <p className="max-w-md">
            Every commit gets its own preview deployment, defaulting to private
            but easily made public
          </p>
        </div>
        <div className="md:w-1/2 w-full mt-20 md:mt-0 items-center flex flex-col text-center">
          <img src={Detailing} width={350} height="100%" className="mb-10" />
          <h5 className="mb-5">Auto Detailing (Interior & Deep Exterior)</h5>
          <p className="max-w-md">
            Tied directly to a branch, custom environments get their own
            environment variables and a static URL
          </p>
        </div>
      </div>
    </div>
  );
}

function Brands() {
  return (
    <div className="relative max-w-6xl mx-auto px-5 flex md:gap-20 gap-10 py-20 md:flex-row flex-col">
      <div className="md:w-[25%] w-full justify-center flex flex-col items-center md:items-start">
        <h2 className="text-5xl text-black">Extend your build</h2>
        <p className="mb-6 text-center md:text-left">
          Integrate with apps and platforms to enhance what your Hydrogen
          storefront can do.
        </p>
        <Link to={`/`}>
          <p className="bg-[#FED550] border-4 border-black py-2 px-4 text-center">
            Explore Hydro Apps
          </p>
        </Link>
      </div>
      <div className="md:w-[75%] w-full">
        <img src={Branded} width={900} />
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
