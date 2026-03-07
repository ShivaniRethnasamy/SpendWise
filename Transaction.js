

const transactionModelSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    type: {
        type: String,
        required: true,
        enum: ["income", "expense"]
    },

    category: {
        type: String,
        default: "Miscellaneous"
    },

    note: {
        type: String,
        trim: true
    },

    date: {
        type: Date,
        default: () => Date.now()
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Transaction", transactionModelSchema);