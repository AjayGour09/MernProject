import React from 'react'
import { Link } from 'react-router-dom'

const OpenAccount = () => {
  return (
    <>
      <div style={{ marginTop: "120px" }}>
        <h2 className="text-center mt-5">
          Open a Zerodha Account
        </h2>

        <p className="text-center mt-4 text-muted">
          Modern platforms and apps,&nbsp;₹0 investments,&nbsp;and flat ₹20 intraday and F&O trades.
        </p>

        <div className="text-center mt-4">
          <Link to="/signup" className="btn btn-primary text-decoration-none text-white px-4 py-2">
            Sign Up for free
          </Link>
        </div>
      </div>
    </>
  )
}

export default OpenAccount
