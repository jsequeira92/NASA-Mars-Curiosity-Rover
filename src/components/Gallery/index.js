import React from 'react';
import axios from 'axios';
import { ContentWrapper } from '../Layout';
import ImageDisplay from './ImageDisplay';
import { Loader, SelectBox } from '../Common';

import './styles.scss';

//main homepage display the images of NASA Mars rover
class Gallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            cameraOptions: [],       //storing the camera options
            selectedCamOptions: [],  //storing the selected camera options
            solOptions: [],          //storing the sol options
            selectedSolOptions: [],  //storing the selected sol options
            filteredImages: []       //storing the images based on selected camera and/or sol options
        }
    }

    // fetching the data via nasa API and storing the images in the state.
    async componentDidMount() {
        const payload = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=OTgKhdRxKAfospr3s9v1cNhyBmsytL4tHfDdMz0E');
        if (payload.status === 200) {
            this.setState({
                images: payload.data.photos,
            });
        }

        //obtaining the distinct sols from the data
        const solOptions = Array.from(new Set(payload.data.photos.map(pic => pic.sol))).map(sol => {
            if (payload.data.photos.find(pic => pic.sol === sol)) {
                return {
                    value: sol, label: sol, isChecked: false
                }
            }
            return null;
        });
        const cameraOptions = [];

        // obtaining the distinct camera options from the data
        payload.data.photos.forEach(pic => {
            pic.rover.cameras.forEach(camera => {
                cameraOptions.push({
                    value: camera.name, label: camera.full_name, isChecked: false
                });
            })
        });
        this.setState({
            solOptions,
            cameraOptions: Array.from(new Set(cameraOptions.map(option => option.value))).map(value => cameraOptions.find(option => option.value === value))
        });
    }


    // function to filter the images based on selected camera option(s) selected/unselected
    fetchPicturesBasedonCamera = (value) => {
        const {
            cameraOptions, images, selectedCamOptions, filteredImages, selectedSolOptions
        } = this.state;
        let selectedOptions = selectedCamOptions; //any previously selected camera options
        let newFilter = [];

        // updating the selected options to have newly selected camera options
        cameraOptions.forEach(camOption => {
            if (camOption.value === value.value) {
                camOption.isChecked = !camOption.isChecked;
                value.isChecked ? selectedOptions.push(value) : selectedOptions = selectedOptions.filter(option => option.value !== value.value);
            }
        })

        // based on selected options, filtering the existing images i.e. filtered images or push new images using the image data set
        if (selectedOptions.length > 0) {
            let temp = 0;
            selectedOptions.forEach(option => {
                if (filteredImages.length > 0) {
                    temp = filteredImages.filter(img => img.camera.name === option.value);
                    if (temp.length === 0) { //if the filtered image data set does not contain images based on the option, query from the original dataset
                        temp = images.filter(img => img.camera.name === option.value);
                        newFilter.push(...temp);
                    } else {
                        newFilter.push(...temp);
                    }
                } else { //if there is no filtered images i.e. selecting the options for the first time
                    newFilter.push(...images.filter(img => img.camera.name === option.value));
                }
            });
            this.setState({
                cameraOptions,
                filteredImages: newFilter,
                selectedCamOptions: selectedOptions
            });
        } else { //if there no selected camera options, filter the images if only there are selected sol options otherwise do not show any images
            if (selectedSolOptions.length > 0) {
                selectedSolOptions.forEach(option => {
                    newFilter.push(...images.filter(img => img.camera.name === option.value));
                });
            }
            this.setState({
                cameraOptions,
                filteredImages: newFilter.length > 0 ? newFilter : [],
                selectedCamOptions: selectedOptions
            })
        }
    }

    // functon to filter images based on sol options selected/unselected
    fetchPicturesBasedonSol = (value) => {
        const {
            solOptions, images, selectedSolOptions, filteredImages, selectedCamOptions
        } = this.state;
        let selectedOptions = selectedSolOptions;   //any previously selected sol options
        const newFilter = [];

        // updating the selected options to have newly selected sol options
        solOptions.forEach(solOption => {
            if (solOption.value === value.value) {
                solOption.isChecked = !solOption.isChecked;
                value.isChecked ? selectedOptions.push(value) : selectedOptions = selectedOptions.filter(option => option.value !== value.value);
            }
        })

        // if there any sol options selected, filtering the existing images i.e. filtered images or push new images using the image data set
        if (selectedOptions.length > 0) {
            let temp = [];
            selectedOptions.forEach(option => {
                if (filteredImages.length > 0) {
                    temp = filteredImages.filter(img => img.sol === option.value);
                    if (temp.length === 0) { //if the filtered image data set does not contain images based on the option, query from the original dataset
                        temp = images.filter(img => img.sol === option.value);
                        newFilter.push(...temp);
                    } else {
                        newFilter.push(...temp);
                    }
                } else { //if there filtered data set is empty i.e. selecting options for the first time
                    temp.push(...images.filter(img => img.sol === option.value));
                }
            });
            this.setState({
                solOptions,
                filteredImages: newFilter,
                selectedSolOptions: selectedOptions
            });
        } else { // if there aren't any sol options selected, filter images based on selected camera options

            if (selectedCamOptions.length > 0) {
                selectedCamOptions.forEach(option => {
                    newFilter.push(...images.filter(img => img.camera.name === option.value));
                });
            }
            this.setState({
                solOptions,
                filteredImages: newFilter.length > 0 ? newFilter : [],  //if there are no selected camera options, push in empty data set
                selectedSolOptions: selectedOptions
            })
        }
    }

    // function to display/hide images upon selection/deselection of all camera options
    selectorClearCameraAll = toggle => {
        const {
            cameraOptions, images, selectedSolOptions
        } = this.state;
        let temp = [];
        if (selectedSolOptions.length > 0) { //if there any selected sol options, filter images based on that
            selectedSolOptions.forEach(option => {
                temp.push(...images.filter(img => img.sol === option.value))
            });
        }
        if (toggle) { //if all camera options are selected
            cameraOptions.forEach(camOption => camOption.isChecked = true);
            this.setState({
                cameraOptions,
                filteredImages: temp.length > 0 ? temp : images,  //if there are any selected sol options, set the filtered images otherwise display all images
                selectedCamOptions: cameraOptions
            });
        } else { // if all the camera options are deselected
            cameraOptions.forEach(camOption => camOption.isChecked = false);
            this.setState({
                cameraOptions,
                filteredImages: temp.length > 0 ? temp : [],  //if there are any selected sol options, set the filtered images otherwise push in empty data set
                selectedCamOptions: []
            });
        }

    }


    //function to filter images upon selection/deselection of all sol options 
    selectOrClearSolAll = toggle => {
        const {
            solOptions, selectedCamOptions, images
        } = this.state;
        let temp = [];
        if (selectedCamOptions.length > 0) { //if there any selected camera options filter the images accordingly
            selectedCamOptions.forEach(option => {
                temp.push(...images.filter(img => img.camera.name === option.value));
            });
        }
        if (toggle) {
            solOptions.forEach(option => option.isChecked = true);
            this.setState({
                solOptions,
                selectedSolOptions: solOptions,
                filteredImages: temp.length > 0 ? temp : images //if there is filtered image set, display that or display all images
            });
        } else {
            solOptions.forEach(solOption => solOption.isChecked = false);
            this.setState(state => {
                return {
                    solOptions: [],
                    filteredImages: temp.length > 0 ? temp : [], // if there is filtered image set, display that or push in empty data set
                    selectedSolOptions: [],

                }
            })
        }

    }



    render() {
        const {
            filteredImages, cameraOptions, solOptions, images
        } = this.state;
        console.log('state', filteredImages);
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>
                        <h2 className="text-primary">Curiosity Images</h2>
                        <small style={{ marginTop: '10px' }}>Landed 2011-11-26 | Landed: 2012-08-06 | Max Sol: 2540</small>
                    </div>
                </div>
                <div className="query-selector">
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Cameras</label>
                    <SelectBox
                        identifier="camera"
                        options={cameraOptions}
                        handleOnChange={value => this.fetchPicturesBasedonCamera(value)}
                        selectOrClearAll={this.selectorClearCameraAll}
                    />
                    <label style={{ marginLeft: '20px', marginRight: '10px', fontWeight: 'bold' }}>Sol</label>
                    <SelectBox
                        identifier="sol"
                        options={solOptions}
                        handleOnChange={value => this.fetchPicturesBasedonSol(value)}
                        selectOrClearAll={this.selectOrClearSolAll}
                    />
                </div>

                <div className="image-gallery-container">
                    {images.length > 0 ? <div className="image-gallery">
                        <ImageDisplay
                            images={filteredImages}
                        />
                    </div> : <Loader />}
                </div>
            </ContentWrapper>
        )
    }
}

export default Gallery;

