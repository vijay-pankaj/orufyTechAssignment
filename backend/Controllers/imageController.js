const imagemodel=require('../Models/productImgModel');

exports.deleteimg = async (req, res) => {
  try {
    const imgid = req.params.id;
    console.log("imageid:",imgid);

    if (!imgid) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const deletedImg = await imagemodel.findByIdAndDelete(imgid);
    if (!deletedImg) {
      return res.status(404).json({ message: "Image not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Image deleted successfully!",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error while deleting Image",
    });
  }
};
