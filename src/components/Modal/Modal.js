import React, { PropTypes } from 'react';
import ModalDialog from './ModalDialog';
import Shared from '../../Shared';
import defaultTheme from 'theme/components/Modal';
import ReactOverlaysModal from 'react-overlays/lib/Modal';
import compose from 'recompose/compose';
import cx from 'classnames/dedupe';
import mapProps from 'recompose/mapProps';
import withContext from 'recompose/withContext';
import { merge } from 'ramda';

const modalStyle = {
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 1040,
};

const systemStyles = {
  backdrop: {
    ...modalStyle,
    backgroundColor: '#000',
    opacity: 0.4,
    zIndex: 'auto',
  },
  modal: modalStyle,
};

const modalProps = (props) => {
  const { backdrop, buttons, className, headerContent, onHide, sheet, style, theme } = props;

  return merge(props, {
    backdrop: !!backdrop,
    backdropClassName: cx(sheet.classes.backdrop, theme.classes.backdrop, className),
    backdropStyle: theme.styles.backdrop,
    className: cx(sheet.classes.modal, theme.classes.modal, className),
    dialogProps: { buttons, headerContent, onHide, sheet, theme },
    show: true,
    style: merge(theme.styles.modal, style),
  });
};

const ModalBase = ({ children, dialogProps, ...rest }) => (
  <ReactOverlaysModal {...rest}>
    <ModalDialog {...dialogProps}>{children}</ModalDialog>
  </ReactOverlaysModal>
);

ModalBase.propTypes = { children: PropTypes.node, dialogProps: PropTypes.object };

const ModalContainer = compose(
  withContext(
    { coreuiModalContext: PropTypes.object },
    ({ onHide }) => ({ coreuiModalContext: { onHide } })
  ),
  mapProps(modalProps)
)(ModalBase);

const StyledModal = Shared.useSheet(ModalContainer, systemStyles);

const Modal = (props) => <StyledModal {...props}>{props.children}</StyledModal>;

const classes = defaultTheme.classes;
const options = defaultTheme.options;
const styles = defaultTheme.styles;

Modal.defaultProps = {
  backdrop: true,

  theme: { classes, options, styles },
};

Modal.displayName = 'Modal';

Modal.propTypes = {
  /**
   * When `true` The modal will automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes. This also
   * works correctly with any Modal children that have the `autoFocus` prop.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  autoFocus: PropTypes.bool,

  /**
   * Include a backdrop component.
   */
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['static']),
  ]),

  /**
   * The `timeout` of the backdrop transition if specified. This number is used to
   * ensure that transition callbacks are always fired, even if browser transition events are canceled.
   *
   * See the Transition `timeout` prop for more infomation.
   */
  backdropTransitionTimeout: PropTypes.number,

  children: PropTypes.node,

  /**
   * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
   *
   * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
   * page content can be placed behind a virtual backdrop as well as a visual one.
   */
  container: PropTypes.any,

  /**
   * The `timeout` of the dialog transition if specified. This number is used to ensure that
   * transition callbacks are always fired, even if browser transition events are canceled.
   *
   * See the Transition `timeout` prop for more infomation.
   */
  dialogTransitionTimeout: PropTypes.number,

  /**
   * When `true` The modal will prevent focus from leaving the Modal while open.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  enforceFocus: PropTypes.bool,

  /**
   * Close the modal when escape key is pressed
   */
  keyboard: PropTypes.bool,

  /**
   * A callback fired when the backdrop, if specified, is clicked.
   */
  onBackdropClick: PropTypes.func,

  /**
   * Callback fired before the Modal transitions in
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning in
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition in
   */
  onEntering: PropTypes.func,

  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   */
  onEscapeKeyUp: PropTypes.func,

  /**
   * Callback fired right before the Modal transitions out
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning out
   */
  onExited: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition out
   */
  onExiting: PropTypes.func,

  /**
   * A callback fired when either the backdrop is clicked, or the escape key is pressed.
   *
   * The `onHide` callback only signals intent from the Modal,
   * you must actually set the `show` prop to `false` for the Modal to close.
   */
  onHide: PropTypes.func,

  /**
   * A callback fired when the Modal is opening.
   */
  onShow: PropTypes.func,

  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  /**
   * A `<Transition/>` component to use for the dialog and backdrop components.
   */
  transition: PropTypes.element, 
};

Shared.registerComponent('Modal', Modal);

export default Modal;
