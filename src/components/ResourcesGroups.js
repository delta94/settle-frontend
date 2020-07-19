import React, {useState} from 'react';
import './ResourcesGroups.scss';
import { Link } from 'react-router-dom';
import { PropertyOverview, GlowInlineLoader, Carousel } from '.'
import { PropertySliderOverview } from './PropertyOverview';
import {onScrollToBottom} from '../utils';
import { useRestoreScrollState } from '../hooks';
import { useGlobalState } from 'state-pool';


function GenericResourcesGroup(props) {
    useRestoreScrollState();
    const [loading, setLoading] = useState(false);
    const [view, ,setView] = useGlobalState(props.viewKey, {default: 'grid'});
    let { next, results } = props.resources;

    let fetchMoreResources = () => {
        if(props.onScrollToBottom !== undefined && next !== null){
            setLoading(true);
            props.onScrollToBottom(props.resources);
        }
        else{
            setLoading(false);
        }
    }

    const getView = () => {
        if (view === 'list') {
            return "col-12 col-sm-6"
        }
        return "col-6 col-sm-6"
    }

    const showListView = (e) => {
        setView("list");
    }

    const showGridView = (e) => {
        setView("grid");
    }

    window.onScrollActions.fetchMoreResources = onScrollToBottom(fetchMoreResources);

    return (
        <div class="row m-0 p-0">
            {view === "list" ?
                <span class="view-icon d-sm-none fas fa-th-large" onClick={showGridView}></span>:
                <span class="view-icon d-sm-none fas fa-list-ul" onClick={showListView}></span>
            }
            <div class="group-header col-12 p-0 m-0 px-1 px-sm-2">{props.header}</div>
            {results.length === 0?
                <div class="ml-2 mt-5">
                  <div>
                      No results found!..
                  </div>
                </div>:
                null
            }
            {results.map(resource =>
                <div class={`${getView()} col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2`}>
                    {props.children(resource)}
                </div>
            )}
            {loading?
                <GlowInlineLoader/>:
                null
            }
        </div>
    )
}


function PropertiesGroup(props) {
    return (
        <GenericResourcesGroup
            viewKey={props.viewKey}
            header={props.header}
            resources={props.properties}
            onScrollToBottom={props.onScrollToBottom}>
            {property =>
                <PropertyOverview property={property} />
            }
        </GenericResourcesGroup>
    )
}


function SliderPropertiesGroup(props) {
    let properties = props.properties.results;
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
        centerMode: true,
        centerPadding: "50px 0 0 0",
        adaptiveHeight: true,
        swipeToSlide: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    initialSlide: 0,
                }
            }
        ]
    }

    return (
        <div class="property-container row m-0 p-0">
            <div class="group-header col-12 p-0 m-0 px-2 px-sm-4">{props.header}</div>
            <Carousel className="col-12 p-0 m-0 mt-2 slider" {...settings}>
                {properties.map(property =>
                    <div class="m-0 p-0 pl-2  pl-sm-0 ml-sm-4 pr-sm-3">
                        <PropertySliderOverview property={property}/>
                    </div>
                )}
            </Carousel>
        </div>
    )
}


function TwoRowsPropertiesGroup(props) {
    let properties = props.properties.results;
    return (
        <div class="property-container row m-0 p-0       d-4 d-sm-4 d-md-6 d-lg-8">
            <div class="group-header col-12 m-0 p-0 px-1 px-sm-2">{props.header}</div>
            {properties.slice(0,8).map((property, index) =>
                <div class={`col-6 col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2   d-none-${index+1}`}>
                    <PropertyOverview property={property}/>
                </div>
            )}
            {props.footer?
                <div class="group-footer col-12 m-0 p-0 px-1 px-sm-2 mt-2">
                    <div class="row p-0 m-0">
                        <Link to={props.footerLink} class="show-all-btn btn-ripple text-decoration-none col-12 text-center d-md-none py-2 bw-1">
                            {props.footer}
                        </Link>

                        <Link to={props.footerLink} class="show-all-btn-md text-decoration-none d-none d-md-inline bw-1 bw-md-0">
                            {props.footer}
                        </Link>
                    </div>
                </div>:
                null
            }
        </div>
    )
}


export { GenericResourcesGroup, PropertiesGroup, SliderPropertiesGroup, TwoRowsPropertiesGroup };
