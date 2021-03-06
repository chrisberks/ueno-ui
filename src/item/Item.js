import React, { Component, PropTypes } from 'react';
import Waypoint from 'react-waypoint';
import { canUseDOM } from '../utils';

import s from './Item.scss';

export default class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
    link: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static defaultProps = {
    tags: [],
  };

  state = {
    isReady: false,
  };

  componentDidMount() {
    this.readyTimer = setTimeout(
      () => {
        this.setState({ isReady: true });
      },
      10,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.readyTimer);
  }

  onChange = ({ currentPosition }) => {
    if (!this.hostEl) return;

    const { classList } = this.hostEl;

    if (currentPosition === 'inside') {
      classList.add(s.isActive);
      this.timer = setTimeout(
        () => {
          classList.add(s.isDone);
        },
        1000,
      );
    }

    if (currentPosition === 'below') {
      clearTimeout(this.timer);
      classList.remove(s.isActive);
      classList.remove(s.isDone);
    }

    if (currentPosition === 'above') {
      clearTimeout(this.timer);
      classList.add(s.isActive);
      classList.add(s.isDone);
    }
  };

  onClick = (e) => {
    const { link } = this.props;
    const isExternal = /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(link);

    if (!isExternal) {
      e.preventDefault();

      this.context.router.history.push(link);
    }
  };

  render() {
    const { name, tags, link, children } = this.props;

    const isExternal = /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(link);

    return (
      <a
        href={link}
        ref={el => this.hostEl = el}
        className={s.item}
        target={isExternal ? '_blank' : null}
        rel={isExternal ? 'noopener' : null}
        onClick={this.onClick}
      >

        <Waypoint
          scrollableAncestor={canUseDOM ? window : undefined}
          topOffset={200}
          onPositionChange={this.onChange}
        />
        <div className={s.item__imageWrap}>
          <div className={s.item__scale}>
            <div className={s.item__assets}>
              {children}
            </div>
          </div>
        </div>

        <div className={s.item__center}>
          <h3 className={s.item__heading}>{name}</h3>

          <ul className={s.item__typelist}>
            {tags.map(tag => (
              <li className={s.item__type} key={`tag-${tag}`}>{tag}</li>
            ))}
          </ul>
        </div>
      </a>
    );
  }
}
