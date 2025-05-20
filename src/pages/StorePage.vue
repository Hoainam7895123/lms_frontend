<template>
    <div class="container mt-4">
        <!-- Card chứa bảng -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Danh sách bài nộp</h5>
                    <div>Bài tập: {{ homework.title }}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div>
                        <a :href="homework.file">Link: <span style="color: #000">Bài tập</span></a>
                    </div>
                    <div>
                        <button @click="exportExcel" class="rounded-3 btn btn-primary">
                            Xuất báo cáo
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <!-- Trạng thái đang tải -->
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Đang tải...</span>
                    </div>
                </div>

                <!-- Bảng danh sách bài nộp -->
                <div v-else class="table-responsive">
                    <table class="table table-vcenter card-table">
                        <thead>
                            <tr>
                                <th>Tên học viên</th>
                                <th>File bài nộp</th>
                                <th>Điểm</th>
                                <th>Chấm bởi</th>
                                <th>Ngày nộp</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Trạng thái trống -->
                            <tr v-if="!submissions.length">
                                <td colspan="4" class="text-center text-muted">
                                    Không có bài nộp nào.
                                </td>
                            </tr>
                            <!-- Dòng bài nộp -->
                            <tr v-for="submission in submissions" :key="submission._id">
                                <td>{{ submission.student_id.name || 'N/A' }}</td>
                                <td>
                                    <a
                                        v-if="submission.file"
                                        :href="submission.file"
                                        target="_blank"
                                        class="text-primary"
                                    >
                                        Xem file
                                    </a>
                                    <div style="color: red" v-else href="">Chưa nộp bài</div>
                                </td>
                                <td>{{ submission.score || 'N/A' }}</td>
                                <td>{{ submission.rated_by || 'N/A' }}</td>

                                <td>{{ formatDate(submission.date_of_submission) }}</td>
                                <td v-show="submission.score === '0' && submission.file">
                                    <button
                                        class="btn btn-sm btn-primary"
                                        @click="openGradeModal(submission)"
                                    >
                                        Chấm điểm
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal chấm điểm -->
        <div
            v-if="showGradeModal"
            class="modal modal-blur fade show"
            style="display: block"
            tabindex="-1"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chấm điểm bài nộp</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="showGradeModal = false"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Điểm số (0-100)</label>
                            <input
                                v-model.number="gradeForm.score"
                                type="number"
                                class="form-control"
                                min="0"
                                max="100"
                                placeholder="Nhập điểm số"
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nhận xét</label>
                            <textarea
                                v-model="gradeForm.comment"
                                class="form-control"
                                rows="4"
                                placeholder="Nhập nhận xét"
                            ></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="showGradeModal = false"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="submitGrade"
                            :disabled="gradeForm.score < 0 || gradeForm.score > 100"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'StorePage',
    data() {
        return {
            homeworkId: '',
            homework: '',
            submissions: [], // Danh sách bài nộp
            loading: false,
            showGradeModal: false, // Hiển thị modal chấm điểm
            gradeForm: {
                submissionId: null,
                score: null,
                comment: '',
            },
        };
    },
    created() {
        this.homeworkId = this.$route.params.homeworkId;
        this.fetchSubmissions();
        this.fetchHomework();
    },
    methods: {
        async fetchSubmissions() {
            this.loading = true;
            try {
                const response = await axios.get(`/api/submissions/homeworks/${this.homeworkId}`);
                console.log('Response:', response);

                this.submissions = response.data.data.submissions || [];
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài nộp:', error);
                this.submissions = [];
            } finally {
                this.loading = false;
            }
        },
        openGradeModal(submission) {
            this.gradeForm = {
                submissionId: submission._id,
                score: null,
                comment: '',
            };
            this.showGradeModal = true;
        },
        async submitGrade() {
            if (
                this.gradeForm.score === null ||
                this.gradeForm.score < 0 ||
                this.gradeForm.score > 100
            ) {
                alert('Vui lòng nhập điểm số hợp lệ (0-100).');
                return;
            }

            try {
                // Giả lập API chấm điểm
                const response = await axios.put(
                    `/api/submissions/${this.gradeForm.submissionId}/mark`,
                    {
                        score: this.gradeForm.score,
                        comment: this.gradeForm.comment,
                    }
                );
                console.log('Đã chấm điểm:', response.data);
                this.showGradeModal = false;
                this.fetchSubmissions();
            } catch (error) {
                console.error('Lỗi khi chấm điểm:', error);
                alert('Không thể lưu điểm. Vui lòng thử lại.');
            }
        },
        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleString('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
            });
        },
        async fetchHomework() {
            try {
                const response = await axios.get(`/api/homeworks/${this.homeworkId}`);
                this.homework = response.data.data;
            } catch (error) {
                console.log('Error');
            }
        },
        async exportExcel() {
            try {
                const response = await axios.get(`/api/export-excel/homeworks/${this.homeworkId}`, {
                    responseType: 'blob', // <-- QUAN TRỌNG: nhận về file dạng blob
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'submissions.xlsx'); // <-- Tên file gợi ý

                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.log('Error');
            }
        },
    },
};
</script>

<style scoped>
.card-table {
    width: 100%;
}
.modal-dialog-centered {
    display: flex;
    align-items: center;
    min-height: calc(100% - 1rem);
}
</style>
