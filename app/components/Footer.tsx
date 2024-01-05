import {NavLink, useMatches} from '@remix-run/react';
import type {FooterQuery} from 'storefrontapi.generated';
import Facebook from '../../public/facebook.png';
import Instagram from '../../public/instagram.png';
import Tiktok from '../../public/tiktok.png';
import Tools from '../../public/tools.png';

export function Footer({menu}: FooterQuery) {
  return (
    <footer className="footer">
      <div className="px-5 bg-[length:20vw_20vw] background-grid-gray flex flex-col items-center pt-20">
        <div className="z-10 flex flex-col items-center">
          <h3 className="text-white font-bold">WinWish Auto Shop</h3>
          <h5 className="text-sm text-white font-bold">EST | 2022</h5>
          <img src={Tools} width={30} height={30} className="mb-5" />
          <h2 className="text-white text-4xl font-primary tracking-wider">
            (02) 459 8246
          </h2>
          <div className="text-white flex flex-col items-center mb-20">
            <p className="text-[10px]">MONDAY - FRIDAY 7:00 AM - 7:00 PM</p>
            <p className="text-[10px]">
              UNIT 10 NORTHWEST VILLAGE, BAGONGBAYAN MANILA CITY
            </p>
            <p className="text-[10px]">WINWISHAUTOSHOP@GMAIL.COM</p>
          </div>
          <div className="flex flex-row gap-5">
            <a href="https://www.facebook.com/winwishph" target="_blank">
              <img src={Facebook} width={50} height={50} />
            </a>
            <a href="https://www.instagram.com/winwishph" target="_blank">
              <img src={Instagram} width={50} height={50} />
            </a>
            <a href="https://www.tiktok.com/winwishph" target="_blank">
              <img src={Tiktok} width={50} height={50} />
            </a>
          </div>
        </div>
        <div className="flex md:flex-row flex-col items-center justify-between w-full mt-20 mb-10 gap-2 md:gap-0">
          <p className="text-white opacity-50 text-[10px]">
            &copy; 2023 WinWish Auto Shop
          </p>
          <p className="text-white opacity-50 text-[10px]">
            Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({menu}: Pick<FooterQuery, 'menu'>) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
