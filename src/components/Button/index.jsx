import './style.css'

function Button({ children, variant = 'primary', fullWidth = false, ...rest }) {
  const classes = ['btn', `btn--${variant}`]
  if (fullWidth) classes.push('btn--full')
  return (
    <button className={classes.join(' ')} {...rest}>
      {children}
    </button>
  )
}

export default Button

