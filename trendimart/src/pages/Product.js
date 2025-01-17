import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsData } from "../store/slices/productSlice";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";

import FilterBox from "../components/atomComponents/FilterBox";
import DropdownMenu from "../components/atomComponents/DropdownMenu";
import TuneIcon from "@mui/icons-material/Tune";
import CardTwo from "../components/CardTwo";

const ProductPageSec = () => {
  const { data, loading, error } = useSelector((state) => state.products);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortProduct, setProduct] = useState([]);
  const [showFilterBox, setShowFilterBox] = useState(true);
  const [categoryAllProducts, setcategoryAllProducts] = useState([]);
  const [maxValue, setmaxValue] = useState(0);

  const [selectedColor, setSelectedColors] = useState([]);
  const [categoryAllColor, setcategoryAllColor] = useState([]);
  const [clearClicked, setClearClicked] = useState(false);
  const [resultSet, setResultSet] = useState(categoryAllProducts);

  const [sortOrder, setSortOrder] = useState(null);

  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("maxValue:", maxValue);

    return () => {};
  }, [maxValue]);

  useEffect(() => {
    setcategoryAllProducts(
      slug === "all" ? data : data.filter((el) => el.category === slug)
    );
    setSelectedBrands([]);
    setSelectedColors([]);
    // setProduct([]);
    setmaxValue(0);
  }, [slug]);

  useEffect(() => {
    dispatch(fetchProductsData());
  }, [dispatch]);

  useEffect(() => {
    const filteredProducts = categoryAllProducts.filter((product) =>
      selectedBrands.includes(product.brand)
    );
    setFilteredProducts(filteredProducts);
  }, [selectedBrands]);

  useEffect(() => {
    const filteredProducts = categoryAllProducts.filter((product) =>
      selectedColor.includes(product.color)
    );
    console.log("filteredProducts color", filteredProducts);
    setFilteredProducts(filteredProducts);
  }, [selectedColor]);

  const handleClick = () => {
    setShowFilterBox(!showFilterBox);
  };

  const handleBrandCheckboxChange = (event) => {
    const brandName = event.target.value;
    console.log("brandName name", brandName);
    if (event.target.checked) {
      setSelectedBrands((prevSelectedBrands) => [
        ...prevSelectedBrands,
        brandName,
      ]);
    } else {
      setSelectedBrands((prevSelectedBrands) =>
        prevSelectedBrands.filter((brand) => brand !== brandName)
      );
    }
    setClearClicked(false);
  };

  const handleColorCheckboxChange = (event) => {
    const colorName = event.target.value;
    console.log("colorName", colorName);
    setClearClicked(false);
    if (event.target.checked) {
      setSelectedColors((prevSelectedColors) => [
        ...prevSelectedColors,
        colorName,
      ]);
    } else {
      setSelectedColors((prevSelectedColors) =>
        prevSelectedColors.filter((color) => color !== colorName)
      );
    }
  };

  const handleFilterByPrice = (min, max) => {
    const filteredProducts = categoryAllProducts.filter(
      (product) => product.price >= min / 100 && product.price <= max / 100
    );
    setFilteredProducts(filteredProducts);
    setmaxValue(max);
    setClearClicked(false);
  };

  const handleClearButtonClick = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setmaxValue(0);
    setClearClicked(true);
  };

  const handleSortingButtonClick = (event) => {
    const sortName = event.target.innerHTML;
    console.log("sortName", event);

    const sortedProducts = [...categoryAllProducts].sort((a, b) => {
      if (sortName === "Price - Low to High") {
        return a.price - b.price;
      } else if (sortName === "Price - High to Low") {
        return b.price - a.price;
      }
      return 0;
    });

    setcategoryAllProducts(sortedProducts);

    console.log("sortedProducts", sortedProducts);
    console.log("sortName", sortName);
  };

  return (
    <>
      {/* content section start here */}
      <div className="page-content-wrapper  justify-center mt-14">
        <div className="main-content flex">
          <Container
            maxWidth="false"
            sx={{ maxWidth: "1920px" }}
            className="filter-sec-wrapper"
          >
            <div className="flex wrapper">
              <div
                className={`filter-content ${showFilterBox ? "active" : ""}`}
              >
                {showFilterBox && (
                  <FilterBox
                    handleFilterCategory={handleBrandCheckboxChange}
                    categoryAllProducts={categoryAllProducts}
                    handleFilterByPriceProp={handleFilterByPrice}
                    categoryAllColor={categoryAllColor}
                    handleColorCategory={handleColorCheckboxChange}
                    selectedBrands={selectedBrands}
                    selectedColor={selectedColor}
                    clearClicked={clearClicked}
                    handleClearButtonClick={handleClearButtonClick}
                  ></FilterBox>
                )}
              </div>

              <div className="width-100 filtered-product-wrapper">
                <div className="content-wrapper text">
                  <div className="filter-subheading display-end">
                    <div className="filter-container">
                      <div
                        className={`icon-wrapper pointer align-items ${
                          showFilterBox ? "active" : ""
                        }`}
                        onClick={handleClick}
                      >
                        <span className="font-weight-700">Filters</span>
                        <TuneIcon className="icon-tune" fontSize="30px" />
                      </div>
                      {showFilterBox && <div className="filter-box"></div>}
                    </div>

                    <div className="right-contentbaseline">
                      <DropdownMenu
                        handleSorting={handleSortingButtonClick}
                        className="drop-menu"
                      ></DropdownMenu>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex mt-9">
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {selectedBrands.length === 0 &&
                        selectedColor.length === 0 &&
                        maxValue === 0
                          ? categoryAllProducts.map((item) => {
                              return (
                                <CardTwo
                                  prop={item}
                                  filterOn={showFilterBox}
                                  key={item.id}
                                ></CardTwo>
                              );
                            })
                          : filteredProducts.map((item) => {
                              return (
                                <CardTwo
                                  prop={item}
                                  filterOn={showFilterBox}
                                  key={item.id}
                                ></CardTwo>
                              );
                            })}
                      </Grid>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default ProductPageSec;
