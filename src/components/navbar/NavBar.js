// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

type Nav = { title: string, link?: string, selected?: boolean };

type Props = {
  navs?: Nav[],
  showIndex?: boolean,
}

type State = {
  navs: Nav[];
}

class NavBar extends React.Component<Props, State> {
  static defaultProps = {
    navs: [],
    showIndex: true,
  };

  constructor(props: Props) {
    super(props);
    const { showIndex, navs } = props;

    const ensureNavs = navs || [];

    this.state = {
      navs: showIndex ? [
        { title: '易智造', link: '/' }
      ].concat(ensureNavs) : ensureNavs,
    };
  }

  static renderItem({ selected, title, index }: Nav & { index: number }) {
    return (
      <li
        className={`item ${selected ? 'selected' : ''}`}
        key={index}>
        {title}
      </li>
    );
  }

  render() {
    const { navs } = this.state;
    return (
      <ul className="nav-menu">
        {navs.map((item, index) => (
          typeof item.link === 'undefined'
            ? NavBar.renderItem({ ...item, index })
            : <Link
                key={index}
                to={item.link}>{ NavBar.renderItem({ ...item, index }) }</Link>
        ))}
      </ul>
    );
  }
}

export default NavBar;