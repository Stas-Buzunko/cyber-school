import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router';


class EditCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [
        {description: "1",
        main_photo:  "1",
        duration:  "1",
        price:  "1",


            video_link:  "1",
            description2: "1",
            test: "ltest_id",

        }
        ]
}

};

  render() {
      const { description, main_photo, duration, price, lessons, video_link, description2, test  } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">

            <form className="form-horizontal">
              <div className="form-group">
                <label for="inputDescription" className="control-label col-xs-2">Description</label>
                <div className="col-xs-10">
                  <textarea  value={description} rows="10" cols="45" onChange={(e) => this.setState({description: e.target.value})} style={{border: '1px solid'}} />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-xs-2">Main photo</label>
                <div className="col-xs-10">
                  <input  value={main_photo} type="text" className="form-control" onChange={(e) => this.setState({main_photo: e.target.value})}/>
                </div>
              </div>

              <div className="form-group">
                <label  className="control-label col-xs-2">Duration</label>
                <div className="col-xs-10">
                  <input  value={duration} type="text" className="form-control" onChange={(e) => this.setState({duration: e.target.value})}/>
                </div>
              </div>

              <div className="form-group">
                <label for="input" className="control-label col-xs-2">Price</label>
                <div className="col-xs-10">
                  <input  value={price} type="text" className="form-control" onChange={(e) => this.setState({price: e.target.value})}/>
                </div>
              </div>

              <div> lessons: </div>

              <div className="form-group">
                <label  className="control-label col-xs-2">Video link</label>
                <div className="col-xs-10">
                  <input  value={video_link} type="text" className="form-control" onChange={(e) => this.setState({video_link: e.target.value})}/>
                </div>
              </div>

              <div className="form-group">
                <label for="input" className="control-label col-xs-2">Description</label>
                <div className="col-xs-10">
                  <textarea  value={description2} rows="10" cols="45" onChange={(e) => this.setState({description2: e.target.value})} style={{border: '1px solid'}} />
                </div>
              </div>

              <div className="form-group">
                <label for="inputTest" className="control-label col-xs-2">Test</label>
                <div className="col-xs-10">
                  <input  value={test} type="text" className="form-control" onChange={(e) => this.setState({test: e.target.value})}/>
                </div>
              </div>

            </form>

            <button
              type="button"
              className="btn btn-success lg"
              onClick={() => { browserHistory.push(`/admin/courses/new`)
              }}
              >Save course
            </button>
          </div>
        </div>
      </div>
    );
  }

}
export default EditCourse;
