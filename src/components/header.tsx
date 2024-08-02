import React from "react";
import { Link, NavLink, useMatch, useResolvedPath } from "react-router-dom";
import parse from "html-react-parser";
import Tooltip from "../components/too-tip";
import Skeleton from "react-loading-skeleton";
import {
  HeaderProps,
  HeadermenuProps,
  NavbarButtonsProps,
} from "../typescript/layout";

export default function Header({
  header,
  navMenu,
  navbarButtons,
}: {
  header: HeaderProps;
  navMenu: HeadermenuProps;
  navbarButtons: NavbarButtonsProps;
}) {
  let resolved;
  let match;

  console.log(navbarButtons);

  return (
    <header className="header">
      <div className="max-width header-div">
        <div className="wrapper-logo">
          {header.logo ? (
            <Link to="/" title="Contentstack">
              <img
                {...(header.logo.$?.url as {})}
                className="logo"
                src={header.logo.url}
                alt={header.logo.filename}
              />
            </Link>
          ) : (
            <a>
              <Skeleton width={200} />
            </a>
          )}
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon" />
        </label>
        <nav className="menu">
          <ul className="nav-ul header-ul">
            {navMenu.length ? (
              navMenu?.map((list) => (
                <li key={list.label} className="nav-li">
                  {
                    ((resolved = useResolvedPath(list.page_reference[0].url)),
                    (match = useMatch({ path: resolved.pathname, end: true })),
                    (
                      <NavLink
                        {...list.$?.label}
                        to={list.page_reference[0].url}
                        className={match ? "active" : ""}
                      >
                        {list.label}
                      </NavLink>
                    ))
                  }
                </li>
              ))
            ) : (
              <li>
                <a>
                  <Skeleton width={400} />
                </a>
              </li>
            )}
          </ul>
        </nav>
        {navbarButtons && navbarButtons.display && (
          <a
            href={navbarButtons.href.href}
            className="navbar-button"
            title={navbarButtons.href.title}
          >
            {navbarButtons.label.toUpperCase()}
          </a>
        )}
        <div className="json-preview">
          <Tooltip
            content="JSON Preview"
            direction="top"
            dynamic={false}
            delay={200}
            status={0}
          >
            <span data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <img src="/json.svg" alt="JSON Preview icon" />
            </span>
          </Tooltip>
        </div>
      </div>
      {Object.keys(header).length ? (
        <div
          className="note-div"
          {...(header.notification_bar.$?.announcement_text as {})}
        >
          {header.notification_bar.show_announcement &&
            header.notification_bar.announcement_text &&
            parse(header.notification_bar.announcement_text)}
        </div>
      ) : (
        <div className="note-div">
          <Skeleton />
        </div>
      )}
    </header>
  );
}
