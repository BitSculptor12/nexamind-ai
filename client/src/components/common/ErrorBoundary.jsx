
import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      hasError: false
    };
  }

  static getDerivedStateFromError() {

    return {

      hasError: true
    };
  }

  componentDidCatch(error) {

    console.log(error);
  }

  render() {

    if (this.state.hasError) {

      return (

        <div
          style={{

            height: "100vh",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            background: "#0B1020",

            color: "white",

            fontSize: "24px"
          }}
        >

          Something went wrong.

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

